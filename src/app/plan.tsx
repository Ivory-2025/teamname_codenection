import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface ActivityItem {
  id: string;
  time: string;
  title: string;
  location: string;
  category: string;
  votes: number;
  userReaction: 'like' | 'dislike' | null;
}

export default function PlanScreen() {
  // Wizard vs Timeline View state
  const [isSetupComplete, setIsSetupComplete] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [selectedDay, setSelectedDay] = useState<number>(1);

  // Wizard state
  const [travelType, setTravelType] = useState<'solo' | 'group'>('group');
  const [destination, setDestination] = useState<string>('Kyoto, Japan');
  const [dateRange, setDateRange] = useState<string>('Oct 14 - Oct 20, 2026');

  // Timeline & Poll State
  const [activities, setActivities] = useState<ActivityItem[]>([
    {
      id: 'act-1',
      time: '09:00 AM',
      title: 'Arashiyama Bamboo Grove',
      location: 'Ukyo Ward',
      category: 'Sightseeing',
      votes: 3,
      userReaction: 'like',
    },
    {
      id: 'act-2',
      time: '12:30 PM',
      title: 'Nishiki Market Food Crawl',
      location: 'Nakagyo Ward',
      category: 'Dining',
      votes: 4,
      userReaction: null,
    },
    {
      id: 'act-3',
      time: '03:30 PM',
      title: 'Fushimi Inari Taisha Shrine',
      location: 'Fushimi Ward',
      category: 'Culture',
      votes: 1,
      userReaction: 'dislike',
    },
  ]);

  // Reorder Handler (Simulates Drag-and-Drop sequence shifts)
  const moveActivity = (index: number, direction: 'up' | 'down') => {
    if (isLocked) {
      Alert.alert('Itinerary Locked', 'Unlock the plan to adjust stop sequences.');
      return;
    }
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= activities.length) return;

    const updated = [...activities];
    const [movedItem] = updated.splice(index, 1);
    updated.splice(newIndex, 0, movedItem);
    setActivities(updated);
  };

  // Vote & Reaction Handlers
  const handleReaction = (id: string, reaction: 'like' | 'dislike') => {
    if (isLocked) return;
    setActivities((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const currentReaction = item.userReaction;
        if (currentReaction === reaction) {
          return {
            ...item,
            userReaction: null,
            votes: reaction === 'like' ? item.votes - 1 : item.votes,
          };
        }
        return {
          ...item,
          userReaction: reaction,
          votes:
            reaction === 'like'
              ? currentReaction === null
                ? item.votes + 1
                : item.votes + 1
              : currentReaction === 'like'
              ? item.votes - 1
              : item.votes,
        };
      })
    );
  };

  // Toggle Lock-in Itinerary
  const handleToggleLock = () => {
    setIsLocked((prev) => {
      const nextState = !prev;
      Alert.alert(
        nextState ? 'Itinerary Locked' : 'Itinerary Unlocked',
        nextState
          ? 'Plan frozen and cached for offline use.'
          : 'Edits and reordering re-enabled.'
      );
      return nextState;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* ========================================================================= */}
      {/* STEP 1: CONVERSATIONAL SETUP WIZARD                                       */}
      {/* ========================================================================= */}
      {!isSetupComplete ? (
        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <View className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <View className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4" />
            <Text className="text-xs font-bold text-teal-600 uppercase tracking-widest">
              AI Travel Assistant
            </Text>
            <Text className="text-2xl font-bold text-gray-900 mt-1">
              Let's craft your journey
            </Text>
            <Text className="text-xs text-gray-500 mb-6 mt-1">
              Answer a few questions so the AI can generate your custom itinerary.
            </Text>

            {/* Travel Mode Toggle */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-2">
              1. Travel Group Type
            </Text>
            <View className="flex-row gap-3 mb-5">
              <TouchableOpacity
                onPress={() => setTravelType('solo')}
                className={`flex-1 p-3.5 rounded-2xl border items-center ${
                  travelType === 'solo'
                    ? 'bg-teal-50 border-teal-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className="text-xl mb-1">🎒</Text>
                <Text
                  className={`text-xs font-bold ${
                    travelType === 'solo' ? 'text-teal-700' : 'text-gray-600'
                  }`}
                >
                  Solo Trip
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setTravelType('group')}
                className={`flex-1 p-3.5 rounded-2xl border items-center ${
                  travelType === 'group'
                    ? 'bg-teal-50 border-teal-500'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <Text className="text-xl mb-1">👥</Text>
                <Text
                  className={`text-xs font-bold ${
                    travelType === 'group' ? 'text-teal-700' : 'text-gray-600'
                  }`}
                >
                  Group Trip
                </Text>
              </TouchableOpacity>
            </View>

            {/* Destination Input */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-2">
              2. Destination
            </Text>
            <TextInput
              value={destination}
              onChangeText={setDestination}
              placeholder="e.g., Tokyo, Osaka, Kyoto"
              className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold text-gray-800 mb-5"
            />

            {/* Date Range Picker Placeholder */}
            <Text className="text-xs font-bold text-gray-700 uppercase mb-2">
              3. Travel Dates
            </Text>
            <TextInput
              value={dateRange}
              onChangeText={setDateRange}
              placeholder="e.g., Oct 14 - Oct 20, 2026"
              className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-semibold text-gray-800 mb-6"
            />

            {/* Trigger AI Plan Generation */}
            <TouchableOpacity
              onPress={() => setIsSetupComplete(true)}
              className="bg-teal-600 py-4 rounded-2xl items-center shadow-sm active:opacity-90"
            >
              <Text className="text-white font-bold text-sm">
                Generate Smart Itinerary ✨
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        /* ========================================================================= */
        /* STEP 2: TIMELINE BUILDER, POLLS & LOCK-IN                                 */
        /* ========================================================================= */
        <View className="flex-1">
          {/* Top Itinerary Action Bar */}
          <View className="bg-white border-b border-gray-200 px-4 py-3 flex-row justify-between items-center">
            <View>
              <Text className="text-base font-bold text-gray-900">{destination}</Text>
              <Text className="text-[10px] text-gray-500 font-medium">{dateRange}</Text>
            </View>

            {/* Lock-In / Unlock Button */}
            <TouchableOpacity
              onPress={handleToggleLock}
              className={`px-3.5 py-2 rounded-full flex-row items-center gap-1.5 border ${
                isLocked
                  ? 'bg-amber-50 border-amber-400'
                  : 'bg-teal-50 border-teal-500'
              }`}
            >
              <Text className="text-xs">{isLocked ? '🔒' : '🔓'}</Text>
              <Text
                className={`text-xs font-bold ${
                  isLocked ? 'text-amber-800' : 'text-teal-700'
                }`}
              >
                {isLocked ? 'Locked (Offline Ready)' : 'Lock Plan'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Day Tabs */}
          <View className="bg-white px-4 py-2 border-b border-gray-100 flex-row gap-2">
            {[1, 2, 3, 4].map((day) => (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(day)}
                className={`px-4 py-1.5 rounded-full ${
                  selectedDay === day ? 'bg-teal-600' : 'bg-gray-100'
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    selectedDay === day ? 'text-white' : 'text-gray-600'
                  }`}
                >
                  Day {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Timeline & Suggestion Polls */}
          <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 60 }}>
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Day {selectedDay} Sequence & Polls
              </Text>
              {!isLocked && (
                <Text className="text-[10px] text-teal-600 font-semibold">
                  Use ▲ / ▼ to reorder stops
                </Text>
              )}
            </View>

            {activities.map((item, index) => (
              <View
                key={item.id}
                className="bg-white p-4 rounded-2xl mb-3 border border-gray-100 shadow-sm"
              >
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 pr-2">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Text className="text-xs font-bold text-teal-600">
                        {item.time}
                      </Text>
                      <Text className="text-[10px] text-gray-400 font-semibold uppercase bg-gray-100 px-2 py-0.5 rounded-full">
                        {item.category}
                      </Text>
                    </View>
                    <Text className="text-base font-bold text-gray-900">
                      {item.title}
                    </Text>
                    <Text className="text-xs text-gray-500 mt-0.5">
                      📍 {item.location}
                    </Text>
                  </View>

                  {/* Reorder Shift Buttons */}
                  {!isLocked && (
                    <View className="flex-col gap-1 items-center justify-center bg-gray-50 p-1 rounded-lg border border-gray-100">
                      <TouchableOpacity
                        onPress={() => moveActivity(index, 'up')}
                        disabled={index === 0}
                        className="px-1.5 py-0.5"
                      >
                        <Text
                          className={`text-xs font-bold ${
                            index === 0 ? 'text-gray-300' : 'text-gray-700'
                          }`}
                        >
                          ▲
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => moveActivity(index, 'down')}
                        disabled={index === activities.length - 1}
                        className="px-1.5 py-0.5"
                      >
                        <Text
                          className={`text-xs font-bold ${
                            index === activities.length - 1
                              ? 'text-gray-300'
                              : 'text-gray-700'
                          }`}
                        >
                          ▼
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                {/* Group Poll & Reaction Bar */}
                <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                      👍 {item.votes} Group Votes
                    </Text>
                  </View>

                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleReaction(item.id, 'like')}
                      className={`px-3 py-1 rounded-xl border flex-row items-center gap-1 ${
                        item.userReaction === 'like'
                          ? 'bg-teal-50 border-teal-500'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Text className="text-xs">👍</Text>
                      <Text
                        className={`text-xs font-bold ${
                          item.userReaction === 'like'
                            ? 'text-teal-700'
                            : 'text-gray-600'
                        }`}
                      >
                        Agree
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleReaction(item.id, 'dislike')}
                      className={`px-3 py-1 rounded-xl border flex-row items-center gap-1 ${
                        item.userReaction === 'dislike'
                          ? 'bg-red-50 border-red-400'
                          : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <Text className="text-xs">👎</Text>
                      <Text
                        className={`text-xs font-bold ${
                          item.userReaction === 'dislike'
                            ? 'text-red-700'
                            : 'text-gray-600'
                        }`}
                      >
                        Pass
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            <TouchableOpacity
              onPress={() => setIsSetupComplete(false)}
              className="mt-4 p-3 items-center"
            >
              <Text className="text-xs text-gray-400 font-bold">
                ← Reconfigure Trip Wizard
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}