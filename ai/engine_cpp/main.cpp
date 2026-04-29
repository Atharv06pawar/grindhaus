#include <algorithm>
#include <cctype>
#include <cmath>
#include <ctime>
#include <filesystem>
#include <fstream>
#include <iomanip>
#include <iostream>
#include <regex>
#include <sstream>
#include <string>

#include "lib/json.hpp"

using json = nlohmann::json;
namespace fs = std::filesystem;

namespace {

constexpr std::size_t kMaxHistoryEntries = 40;
const fs::path kUsersDirectory = "users";

std::string trim(const std::string& value) {
    const auto start = value.find_first_not_of(" \t\r\n");
    if (start == std::string::npos) {
        return "";
    }

    const auto end = value.find_last_not_of(" \t\r\n");
    return value.substr(start, end - start + 1);
}

std::string toLower(std::string value) {
    std::transform(value.begin(), value.end(), value.begin(), [](unsigned char character) {
        return static_cast<char>(std::tolower(character));
    });
    return value;
}

std::string sanitizeUserId(const std::string& userId) {
    std::string safeUserId;
    safeUserId.reserve(userId.size());

    for (unsigned char character : userId) {
        if (std::isalnum(character) || character == '-' || character == '_') {
            safeUserId.push_back(static_cast<char>(character));
        } else {
            safeUserId.push_back('_');
        }
    }

    safeUserId = trim(safeUserId);
    return safeUserId.empty() ? "default-user" : safeUserId;
}

json createDefaultMemory() {
    return json{
        {"name", ""},
        {"weight", 0},
        {"goal", ""},
        {"streak", 0},
        {"last_activity", ""},
        {"history", json::array()}
    };
}

void ensureMemoryShape(json& memory) {
    if (!memory.is_object()) {
        memory = createDefaultMemory();
        return;
    }

    if (!memory.contains("name") || !memory["name"].is_string()) {
        memory["name"] = "";
    }

    if (!memory.contains("weight") || !(memory["weight"].is_number_integer() || memory["weight"].is_number_float())) {
        memory["weight"] = 0;
    }

    if (!memory.contains("goal") || !memory["goal"].is_string()) {
        memory["goal"] = "";
    }

    if (!memory.contains("streak") || !memory["streak"].is_number_integer()) {
        memory["streak"] = 0;
    }

    if (!memory.contains("last_activity") || !memory["last_activity"].is_string()) {
        memory["last_activity"] = "";
    }

    if (!memory.contains("history") || !memory["history"].is_array()) {
        memory["history"] = json::array();
    }
}

fs::path getUserMemoryPath(const std::string& userId) {
    fs::create_directories(kUsersDirectory);
    return kUsersDirectory / (sanitizeUserId(userId) + ".json");
}

std::string formatTimestamp(const char* pattern) {
    const std::time_t now = std::time(nullptr);
    std::tm localTime{};

#ifdef _WIN32
    localtime_s(&localTime, &now);
#else
    localtime_r(&now, &localTime);
#endif

    std::ostringstream stream;
    stream << std::put_time(&localTime, pattern);
    return stream.str();
}

std::string currentDate() {
    return formatTimestamp("%Y-%m-%d");
}

std::string currentTimestamp() {
    return formatTimestamp("%Y-%m-%d %H:%M:%S");
}

int parseDateDifference(const std::string& previousDate, const std::string& currentDateValue) {
    if (previousDate.size() < 10 || currentDateValue.size() < 10) {
        return 0;
    }

    std::tm previous{};
    std::tm current{};

    std::istringstream previousStream(previousDate.substr(0, 10));
    std::istringstream currentStream(currentDateValue.substr(0, 10));

    previousStream >> std::get_time(&previous, "%Y-%m-%d");
    currentStream >> std::get_time(&current, "%Y-%m-%d");

    if (previousStream.fail() || currentStream.fail()) {
        return 0;
    }

    previous.tm_hour = 0;
    previous.tm_min = 0;
    previous.tm_sec = 0;
    previous.tm_isdst = -1;

    current.tm_hour = 0;
    current.tm_min = 0;
    current.tm_sec = 0;
    current.tm_isdst = -1;

    const std::time_t previousTime = std::mktime(&previous);
    const std::time_t currentTime = std::mktime(&current);

    if (previousTime == static_cast<std::time_t>(-1) || currentTime == static_cast<std::time_t>(-1)) {
        return 0;
    }

    constexpr double secondsPerDay = 60.0 * 60.0 * 24.0;
    return static_cast<int>(std::round(std::difftime(currentTime, previousTime) / secondsPerDay));
}

void updateActivity(json& memory) {
    const std::string today = currentDate();
    const std::string lastActivity = memory["last_activity"].get<std::string>();
    int streak = memory["streak"].get<int>();

    if (lastActivity.empty()) {
        streak = 1;
    } else {
        const std::string lastDate = lastActivity.substr(0, 10);

        if (lastDate == today) {
            streak = std::max(streak, 1);
        } else {
            const int dayDifference = parseDateDifference(lastDate, today);
            streak = dayDifference == 1 ? std::max(streak, 1) + 1 : 1;
        }
    }

    memory["streak"] = streak;
    memory["last_activity"] = currentTimestamp();
}

std::string formatWeight(double weight) {
    std::ostringstream stream;

    if (std::fabs(weight - std::round(weight)) < 0.001) {
        stream << static_cast<int>(std::round(weight));
    } else {
        stream << std::fixed << std::setprecision(1) << weight;
    }

    return stream.str();
}

void pushHistoryEntry(json& memory, const std::string& role, const std::string& text) {
    auto& history = memory["history"];
    history.push_back(json{
        {"role", role},
        {"text", text},
        {"timestamp", currentTimestamp()}
    });

    if (history.size() > kMaxHistoryEntries) {
        const auto overflow = history.size() - kMaxHistoryEntries;
        history.erase(history.begin(), history.begin() + static_cast<json::difference_type>(overflow));
    }
}

json loadUserMemory(const std::string& userId) {
    const fs::path memoryPath = getUserMemoryPath(userId);

    if (!fs::exists(memoryPath)) {
        json memory = createDefaultMemory();
        std::ofstream output(memoryPath);
        output << memory.dump(2);
        return memory;
    }

    std::ifstream input(memoryPath);
    if (!input) {
        throw std::runtime_error("Cannot open user memory file.");
    }

    json memory;
    input >> memory;
    ensureMemoryShape(memory);
    return memory;
}

void saveUserMemory(const std::string& userId, const json& memory) {
    const fs::path memoryPath = getUserMemoryPath(userId);
    std::ofstream output(memoryPath);

    if (!output) {
        throw std::runtime_error("Cannot save user memory file.");
    }

    output << memory.dump(2);
}

bool detectNameIntent(const std::string& text, std::string& name) {
    const std::regex pattern(R"(\bmy name is\s+([A-Za-z][A-Za-z\s'\-]{0,48}))", std::regex_constants::icase);
    std::smatch match;

    if (!std::regex_search(text, match, pattern)) {
        return false;
    }

    name = trim(match[1].str());
    return !name.empty();
}

bool detectWeightIntent(const std::string& text, double& weight) {
    const std::regex pattern(R"(\bmy weight is\s+([0-9]+(?:\.[0-9]+)?))", std::regex_constants::icase);
    std::smatch match;

    if (!std::regex_search(text, match, pattern)) {
        return false;
    }

    weight = std::stod(match[1].str());
    return true;
}

bool detectGoalIntent(const std::string& text, std::string& goal) {
    const std::regex pattern(R"(\b(?:my\s+)?goal is\s+(.+)$)", std::regex_constants::icase);
    std::smatch match;

    if (!std::regex_search(text, match, pattern)) {
        return false;
    }

    goal = trim(match[1].str());
    return !goal.empty();
}

std::string buildMemorySummary(const json& memory) {
    std::ostringstream stream;
    const std::string name = memory["name"].get<std::string>();
    const double weight = memory["weight"].get<double>();
    const std::string goal = memory["goal"].get<std::string>();
    const int streak = memory["streak"].get<int>();

    if (!name.empty()) {
        stream << "Name: " << name << ". ";
    }

    if (weight > 0) {
        stream << "Weight: " << formatWeight(weight) << ". ";
    }

    if (!goal.empty()) {
        stream << "Goal: " << goal << ". ";
    }

    stream << "Streak: " << streak << ".";
    return trim(stream.str());
}

std::string buildDefaultReply(const json& memory, const std::string& text) {
    const std::string loweredText = toLower(text);
    const std::string name = memory["name"].get<std::string>();
    const std::string goal = memory["goal"].get<std::string>();
    const double weight = memory["weight"].get<double>();
    const int streak = memory["streak"].get<int>();
    const std::string prefix = name.empty() ? "Listen. " : name + ", ";

    if (loweredText.find("remember") != std::string::npos ||
        loweredText.find("who am i") != std::string::npos ||
        loweredText.find("what do you know") != std::string::npos) {
        return buildMemorySummary(memory);
    }

    if (loweredText.find("streak") != std::string::npos) {
        return prefix + "Streak: " + std::to_string(streak) + ". Protect it.";
    }

    if (loweredText.find("weight") != std::string::npos && weight > 0) {
        return prefix + "Weight: " + formatWeight(weight) + ". Keep it updated weekly.";
    }

    if ((loweredText.find("goal") != std::string::npos || loweredText.find("plan") != std::string::npos) && !goal.empty()) {
        return prefix + "Goal: " + goal + ". Lift hard. Eat clean. Sleep on time.";
    }

    if (loweredText.find("plan") != std::string::npos || loweredText.find("routine") != std::string::npos) {
        return prefix + "Set a goal. Then train, hit protein, and log the work.";
    }

    if (goal.empty()) {
        return prefix + "No goal logged. Set it. Then work.";
    }

    return prefix + "Goal: " + goal + ". Streak: " + std::to_string(streak) + ". Report numbers after training.";
}

std::string buildReply(json& memory, const std::string& text) {
    std::string detectedName;
    double detectedWeight = 0.0;
    std::string detectedGoal;

    if (detectNameIntent(text, detectedName)) {
        memory["name"] = detectedName;
        return "Name logged: " + detectedName + ". Stay consistent.";
    }

    if (detectWeightIntent(text, detectedWeight)) {
        memory["weight"] = detectedWeight;
        return "Weight logged: " + formatWeight(detectedWeight) + ". Track it weekly.";
    }

    if (detectGoalIntent(text, detectedGoal)) {
        memory["goal"] = detectedGoal;
        return "Goal locked: " + detectedGoal + ". Train for it.";
    }

    return buildDefaultReply(memory, text);
}

}  // namespace

int main() {
    try {
        std::ostringstream inputBuffer;
        inputBuffer << std::cin.rdbuf();

        const std::string rawInput = trim(inputBuffer.str());
        if (rawInput.empty()) {
            std::cout << json{{"reply", "No input. Send JSON."}}.dump();
            return 0;
        }

        const json input = json::parse(rawInput);
        const std::string userId = trim(input.value("userId", ""));
        const std::string text = trim(input.value("text", ""));

        if (userId.empty() || text.empty()) {
            std::cout << json{{"reply", "Missing userId or text."}}.dump();
            return 0;
        }

        json memory = loadUserMemory(userId);
        ensureMemoryShape(memory);
        updateActivity(memory);
        pushHistoryEntry(memory, "user", text);

        const std::string reply = buildReply(memory, text);
        pushHistoryEntry(memory, "assistant", reply);

        saveUserMemory(userId, memory);

        std::cout << json{{"reply", reply}}.dump();
        return 0;
    } catch (const std::exception& error) {
        std::cerr << error.what() << std::endl;
        std::cout << json{{"reply", "System error. Retry with clean input."}}.dump();
        return 0;
    }
}
