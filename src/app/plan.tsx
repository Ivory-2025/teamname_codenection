import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const TAG_CATEGORIES = {
  style: [
    { id: 't1', label: '#Chill' },
    { id: 't2', label: '#Adventure' },
    { id: 't3', label: '#CafeHopping' },
    { id: 't4', label: '#Culture' },
    { id: 't5', label: '#Nature' },
    { id: 't6', label: '#Nightlife' },
    { id: 't7', label: '#Photography' },
    { id: 't8', label: '#Shopping' },
  ],
  pace: [
    { id: 'p1', label: '#SleepIn' },
    { id: 'p2', label: '#FastPaced' },
    { id: 'p3', label: '#PackTheDay' },
    { id: 'p4', label: '#Balanced' },
  ],
  diet: [
    { id: 'd1', label: '#Halal' },
    { id: 'd2', label: '#Vegetarian' },
    { id: 'd3', label: '#Vegan' },
    { id: 'd4', label: '#GlutenFree' },
    { id: 'd5', label: '#SeafoodLover' },
  ],
};

interface MemberStatus {
  id: string;
  name: string;
  avatar: string;
  isCompleted: boolean;
  tagsCount: number;
}

const INITIAL_MEMBERS: MemberStatus[] = [
  { id: 'm1', name: 'Ivory (You)', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120', isCompleted: true, tagsCount: 4 },
  { id: 'm2', name: 'Chin Jie', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120', isCompleted: true, tagsCount: 3 },
  { id: 'm3', name: 'ZhiHeng', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120', isCompleted: false, tagsCount: 0 },
  { id: 'm4', name: 'Sarah', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120', isCompleted: false, tagsCount: 0 },
];

const OCTOBER_DAYS = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31,
];

interface ActivityStop {
  id: string;
  time: string;
  title: string;
  category: string;
  location: string;
  rating: string;
  reviews: string;
  cost: string;
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
  image: string;
}

interface PlanVariant {
  id: string;
  name: string;
  tagline: string;
  votes: number;
  userVoted: boolean;
}

export default function AIPlannerScreen() {
  const router = useRouter();

  const [plannerMode, setPlannerMode] = useState<'idle' | 'wizard' | 'draft'>('idle');
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4>(1);

  // Setup Form State
  const [tripName, setTripName] = useState('Autumn in Kansai');
  const [destination, setDestination] = useState('Kyoto & Osaka, Japan');

  // Interactive Calendar Selection & Visibility
  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<number>(14);
  const [endDate, setEndDate] = useState<number>(22);

  const [selectedTags, setSelectedTags] = useState<string[]>([
    '#Chill',
    '#CafeHopping',
    '#SleepIn',
    '#Halal',
  ]);
  const [stayLimit, setStayLimit] = useState('250');
  const [transitCap, setTransitCap] = useState('40');
  const [transitPreference, setTransitPreference] = useState<'Train/Subway' | 'Rideshare/Taxi'>('Train/Subway');
  const [dailyLiving, setDailyLiving] = useState('120');

  // Members Completion Tracker
  const [members] = useState<MemberStatus[]>(INITIAL_MEMBERS);

  // Draft Sandbox States
  const [selectedDay, setSelectedDay] = useState(1);
  const [planVariants, setPlanVariants] = useState<PlanVariant[]>([
    { id: 'v1', name: 'Option A: Relaxed Cultural Flow', tagline: 'Late morning starts, scenic tea houses, minimal walking strain', votes: 3, userVoted: true },
    { id: 'v2', name: 'Option B: Dynamic City Discovery', tagline: 'Early markets, photography hotspots, urban cafe exploration', votes: 1, userVoted: false },
  ]);

  const [timelineStops, setTimelineStops] = useState<ActivityStop[]>([
    {
      id: 'st-1',
      time: '10:30 AM',
      title: 'Arashiyama Bamboo Grove & Riverside',
      category: 'Sightseeing',
      location: 'Ukyo Ward, Kyoto',
      rating: '4.7',
      reviews: '32.4k',
      cost: 'Free',
      likes: 4,
      dislikes: 0,
      userReaction: 'like',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'st-2',
      time: '01:15 PM',
      title: 'Nishiki Market Specialty Food Crawl',
      category: 'Dining & Cafes',
      location: 'Nakagyo Ward, Kyoto',
      rating: '4.5',
      reviews: '18.9k',
      cost: 'RM 55 (¥1,800)',
      likes: 3,
      dislikes: 1,
      userReaction: null,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'st-3',
      time: '04:30 PM',
      title: 'Gion Teahouse Sunset Session',
      category: 'Culture',
      location: 'Gion, Kyoto',
      rating: '4.8',
      reviews: '8.2k',
      cost: 'RM 35 (¥1,200)',
      likes: 4,
      dislikes: 0,
      userReaction: 'like',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    },
  ]);

  const handleDatePress = (day: number) => {
  if (day < startDate) {
    setStartDate(day);
    setEndDate(day + 3);
  } else {
    setEndDate(day);
    // Keep calendar visible until the user explicitly taps the date bar again or scrolls down
  }
};

  const toggleTag = (label: string) => {
    if (selectedTags.includes(label)) {
      setSelectedTags(selectedTags.filter((t) => t !== label));
    } else {
      setSelectedTags([...selectedTags, label]);
    }
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: `Join our trip "${tripName}" on Escape! Fill your tags: app.escape.io/join/kansai-2026`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleNudgeMember = (name: string) => {
    Alert.alert('Ping Sent 💬', `Sent a reminder notification to ${name} to submit their travel tags.`);
  };

  const handleVotePlan = (variantId: string) => {
    setPlanVariants((prev) =>
      prev.map((v) => {
        if (v.id === variantId) {
          return {
            ...v,
            votes: v.userVoted ? v.votes - 1 : v.votes + 1,
            userVoted: !v.userVoted,
          };
        }
        return {
          ...v,
          votes: v.userVoted ? v.votes - 1 : v.votes,
          userVoted: false,
        };
      })
    );
  };

  const handleReactStop = (stopId: string, type: 'like' | 'dislike') => {
    setTimelineStops((prev) =>
      prev.map((stop) => {
        if (stop.id !== stopId) return stop;
        let likes = stop.likes;
        let dislikes = stop.dislikes;

        if (stop.userReaction === type) {
          if (type === 'like') likes--;
          if (type === 'dislike') dislikes--;
          return { ...stop, likes, dislikes, userReaction: null };
        } else {
          if (type === 'like') {
            likes++;
            if (stop.userReaction === 'dislike') dislikes--;
          } else {
            dislikes++;
            if (stop.userReaction === 'like') likes--;
          }
          return { ...stop, likes, dislikes, userReaction: type };
        }
      })
    );
  };

  const completedCount = members.filter((m) => m.isCompleted).length;

  // =========================================================================
  // VIEW 1: FULL SCREEN STEP-BY-STEP ONBOARDING
  // =========================================================================
  if (plannerMode === 'wizard') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* Header */}
        <View style={styles.wizardTopBar}>
          <TouchableOpacity
            onPress={() => {
              if (wizardStep > 1) {
                setWizardStep((prev) => (prev - 1) as any);
              } else {
                setPlannerMode('idle');
              }
            }}
            style={styles.circleBackBtn}
          >
            <Ionicons name="arrow-back" size={20} color="#111827" />
          </TouchableOpacity>

          <View style={styles.wizardTitleCenter}>
            <Text style={styles.wizardNavTitle}>Trip Alignment Setup</Text>
            <Text style={styles.wizardNavStepText}>Step {wizardStep} of 4</Text>
          </View>

          <TouchableOpacity onPress={() => setPlannerMode('idle')} style={styles.circleCloseBtn}>
            <Ionicons name="close" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(wizardStep / 4) * 100}%` }]} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.wizardScrollContent}
        >
          {/* STAGE 1: DATES WITH ACCORDION CALENDAR & DETAILS */}
          {wizardStep === 1 && (
            <View>
              <Text style={styles.fullScreenStepTitle}>Where & When Are You Going?</Text>
              <Text style={styles.fullScreenStepDesc}>
                Set your destination and tap the dates below to select them from the calendar.
              </Text>

              <Text style={styles.fieldLabel}>TRIP NAME</Text>
              <TextInput
                value={tripName}
                onChangeText={setTripName}
                style={styles.fullScreenInput}
                placeholder="e.g. Kansai Autumn Tour"
              />

              <Text style={styles.fieldLabel}>DESTINATION</Text>
              <TextInput
                value={destination}
                onChangeText={setDestination}
                style={styles.fullScreenInput}
                placeholder="e.g. Kyoto & Osaka"
              />

              {/* Collapsible Date Selector Bar */}
              <Text style={styles.fieldLabel}>TRIP DATES</Text>
              <TouchableOpacity
                style={styles.dateSelectorBar}
                activeOpacity={0.8}
                onPress={() => setShowCalendar((prev) => !prev)}
              >
                <View style={styles.dateSelectorLeft}>
                  <Ionicons name="calendar" size={18} color="#0D9488" />
                  <Text style={styles.dateSelectorValue}>
                    Oct {startDate} – Oct {endDate}, 2026
                  </Text>
                </View>
                <View style={styles.durationBadge}>
                  <Text style={styles.durationBadgeText}>{endDate - startDate + 1} Days</Text>
                  <Ionicons
                    name={showCalendar ? 'chevron-up' : 'chevron-down'}
                    size={14}
                    color="#0D9488"
                  />
                </View>
              </TouchableOpacity>

              {/* Unfurled Calendar Grid */}
              {showCalendar && (
                <View style={styles.calendarContainer}>
                  <View style={styles.calendarMonthHeader}>
                    <Text style={styles.calendarMonthTitle}>October 2026</Text>
                    <Text style={styles.calendarPrompt}>Tap start and end dates</Text>
                  </View>

                  <View style={styles.weekDaysRow}>
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, idx) => (
                      <Text key={idx} style={styles.weekDayLabel}>{w}</Text>
                    ))}
                  </View>

                  <View style={styles.daysGrid}>
                    {OCTOBER_DAYS.map((day, idx) => {
                      if (day === null) {
                        return <View key={idx} style={styles.emptyDayCell} />;
                      }

                      const isStart = day === startDate;
                      const isEnd = day === endDate;
                      const inRange = day > startDate && day < endDate;

                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => handleDatePress(day)}
                          style={[
                            styles.dayCell,
                            inRange && styles.dayCellInRange,
                            (isStart || isEnd) && styles.dayCellSelected,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dayCellText,
                              inRange && styles.dayCellTextInRange,
                              (isStart || isEnd) && styles.dayCellTextSelected,
                            ]}
                          >
                            {day}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Share link card */}
              <View style={styles.inviteShareBox}>
                <View style={styles.inviteShareLeft}>
                  <Ionicons name="link" size={18} color="#0D9488" />
                  <View>
                    <Text style={styles.inviteLinkText}>app.escape.io/join/kansai-2026</Text>
                    <Text style={styles.inviteSubText}>Members can open & calibrate tags</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.shareIconBtn} onPress={handleShareInvite}>
                  <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.primaryNextBtn} onPress={() => setWizardStep(2)}>
                <Text style={styles.primaryNextBtnText}>Next: Travel Style & Diet Tags →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STAGE 2: EXTENSIVE TAG SELECTION */}
          {wizardStep === 2 && (
            <View>
              <Text style={styles.fullScreenStepTitle}>Travel Style & Personal Tags</Text>
              <Text style={styles.fullScreenStepDesc}>
                Select your vibe, daily pace, and dietary constraints so AI aligns everyone's preferences.
              </Text>

              <Text style={styles.tagSectionLabel}>TRAVEL STYLE & VIBE</Text>
              <View style={styles.tagWrap}>
                {TAG_CATEGORIES.style.map((tag) => {
                  const isSelected = selectedTags.includes(tag.label);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagPill, isSelected && styles.tagPillActive]}
                    >
                      <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>{tag.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.tagSectionLabel}>DAILY PACE</Text>
              <View style={styles.tagWrap}>
                {TAG_CATEGORIES.pace.map((tag) => {
                  const isSelected = selectedTags.includes(tag.label);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagPill, isSelected && styles.tagPillActive]}
                    >
                      <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>{tag.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <Text style={styles.tagSectionLabel}>DIETARY NEEDS</Text>
              <View style={styles.tagWrap}>
                {TAG_CATEGORIES.diet.map((tag) => {
                  const isSelected = selectedTags.includes(tag.label);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagPill, isSelected && styles.tagPillActive]}
                    >
                      <Text style={[styles.tagPillText, isSelected && styles.tagPillTextActive]}>{tag.label}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.twoBtnRow}>
                <TouchableOpacity style={styles.prevBtn} onPress={() => setWizardStep(1)}>
                  <Text style={styles.prevBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextStepBtnFlex} onPress={() => setWizardStep(3)}>
                  <Text style={styles.primaryNextBtnText}>Next: Budget Limits →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STAGE 3: EXACT NUMERICAL BUDGET INPUTS */}
          {wizardStep === 3 && (
            <View>
              <Text style={styles.fullScreenStepTitle}>Exact Budget Limits</Text>
              <Text style={styles.fullScreenStepDesc}>
                Enter numerical amounts so the AI filters out options above your ceilings.
              </Text>

              <View style={styles.budgetCard}>
                <Text style={styles.budgetCardHeading}>🏨 Stay Limit (Per Room / Night)</Text>
                <View style={styles.numberInputBar}>
                  <Text style={styles.currencyPrefix}>RM</Text>
                  <TextInput
                    value={stayLimit}
                    onChangeText={setStayLimit}
                    keyboardType="numeric"
                    style={styles.numericTextInput}
                  />
                  <Text style={styles.unitSuffix}>/ night</Text>
                </View>
              </View>

              <View style={styles.budgetCard}>
                <Text style={styles.budgetCardHeading}>🚆 Daily Transit Cap & Mode</Text>
                <View style={styles.numberInputBar}>
                  <Text style={styles.currencyPrefix}>RM</Text>
                  <TextInput
                    value={transitCap}
                    onChangeText={setTransitCap}
                    keyboardType="numeric"
                    style={styles.numericTextInput}
                  />
                  <Text style={styles.unitSuffix}>/ day</Text>
                </View>

                <View style={styles.transitToggleRow}>
                  {(['Train/Subway', 'Rideshare/Taxi'] as const).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      onPress={() => setTransitPreference(mode)}
                      style={[styles.prefChip, transitPreference === mode && styles.prefChipActive]}
                    >
                      <Text style={[styles.prefChipText, transitPreference === mode && styles.prefChipTextActive]}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.budgetCard}>
                <Text style={styles.budgetCardHeading}>🍜 Daily Meals, Cafes & Entrance Fees</Text>
                <View style={styles.numberInputBar}>
                  <Text style={styles.currencyPrefix}>RM</Text>
                  <TextInput
                    value={dailyLiving}
                    onChangeText={setDailyLiving}
                    keyboardType="numeric"
                    style={styles.numericTextInput}
                  />
                  <Text style={styles.unitSuffix}>/ day</Text>
                </View>
              </View>

              <View style={styles.twoBtnRow}>
                <TouchableOpacity style={styles.prevBtn} onPress={() => setWizardStep(2)}>
                  <Text style={styles.prevBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextStepBtnFlex} onPress={() => setWizardStep(4)}>
                  <Text style={styles.primaryNextBtnText}>Check Member Status →</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* STAGE 4: MEMBER COMPLETION STATUS & ALIGNMENT BENCHMARK */}
          {wizardStep === 4 && (
            <View>
              <Text style={styles.fullScreenStepTitle}>Group Readiness & Alignment</Text>
              <Text style={styles.fullScreenStepDesc}>
                {completedCount === members.length
                  ? 'All members completed their preferences!'
                  : `${completedCount} of ${members.length} members have filled their preferences.`}
              </Text>

              {/* Members Submission Status List */}
              <View style={styles.membersStatusBox}>
                <View style={styles.membersStatusHeader}>
                  <Text style={styles.statusBoxTitle}>MEMBER SURVEY PROGRESS</Text>
                  <Text style={styles.statusBoxPct}>{completedCount}/{members.length} Ready</Text>
                </View>

                {members.map((m) => (
                  <View key={m.id} style={styles.memberStatusRow}>
                    <Image source={{ uri: m.avatar }} style={styles.memberAvatarSmall} />
                    <View style={styles.flexOne}>
                      <Text style={styles.memberNameText}>{m.name}</Text>
                      <Text style={m.isCompleted ? styles.memberStatusDone : styles.memberStatusPending}>
                        {m.isCompleted ? `✓ ${m.tagsCount} tags submitted` : '⏳ Awaiting input'}
                      </Text>
                    </View>

                    {!m.isCompleted ? (
                      <TouchableOpacity
                        style={styles.nudgeBtn}
                        onPress={() => handleNudgeMember(m.name)}
                      >
                        <Ionicons name="notifications-outline" size={12} color="#D97706" />
                        <Text style={styles.nudgeBtnText}>Nudge</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.checkedCircle}>
                        <Ionicons name="checkmark" size={14} color="#0D9488" />
                      </View>
                    )}
                  </View>
                ))}
              </View>

              {completedCount < members.length && (
                <View style={styles.pendingNoticeCard}>
                  <Ionicons name="alert-circle-outline" size={18} color="#D97706" />
                  <Text style={styles.pendingNoticeText}>
                    ZhiHeng and Sarah haven’t submitted their tags yet. You can nudge them or generate a partial plan now.
                  </Text>
                </View>
              )}

              <View style={styles.consensusBox}>
                <Text style={styles.consensusHeading}>🔥 PARTIAL GROUP MATCHES (2/4)</Text>
                <View style={styles.tagWrap}>
                  <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Chill (2/2)</Text></View>
                  <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#CafeHopping (2/2)</Text></View>
                  <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#SleepIn (2/2)</Text></View>
                  <View style={styles.consensusTag}><Text style={styles.consensusTagText}>#Halal (1/2)</Text></View>
                </View>
                <Text style={styles.consensusNotes}>
                  Matched from active submissions: late mornings, cafe hopping, and Halal dining.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.applyItineraryBtn}
                activeOpacity={0.88}
                onPress={() => setPlannerMode('draft')}
              >
                <Ionicons name="sparkles" size={16} color="#FFFFFF" />
                <Text style={styles.applyItineraryBtnText}>
                  {completedCount < members.length
                    ? 'Generate with Partial Alignment'
                    : 'Generate Full Route Sandbox'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // =========================================================================
  // VIEW 2: IDLE OR DRAFT SCREEN
  // =========================================================================
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Ionicons name="sparkles" size={18} color="#0D9488" />
          <Text style={styles.topBarHeading}>AI Trip Planner</Text>
        </View>

        {plannerMode === 'draft' && (
          <TouchableOpacity
            style={styles.discardBtn}
            onPress={() => {
              Alert.alert('Reset Sandbox?', 'This discards current draft changes.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Reset', style: 'destructive', onPress: () => setPlannerMode('idle') },
              ]);
            }}
          >
            <Text style={styles.discardBtnText}>Reset</Text>
          </TouchableOpacity>
        )}
      </View>

      {plannerMode === 'idle' ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIllustrationBox}>
            <Ionicons name="map-outline" size={56} color="#0D9488" />
            <View style={styles.emptySparkleBadge}>
              <Ionicons name="sparkles" size={16} color="#FFFFFF" />
            </View>
          </View>

          <Text style={styles.emptyTitle}>Create a New Travel Plan</Text>
          <Text style={styles.emptySubtitle}>
            Tap below to choose your destination, pick dates on the calendar, select tags, and track member input.
          </Text>

          <TouchableOpacity
            style={styles.createMainBtn}
            activeOpacity={0.88}
            onPress={() => {
              setWizardStep(1);
              setPlannerMode('wizard');
            }}
          >
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.createMainBtnText}>Start New Travel Planner</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.tripMetaCard}>
            <View style={styles.tripMetaTop}>
              <View>
                <Text style={styles.tripMetaLocation}>{destination.toUpperCase()}</Text>
                <Text style={styles.tripMetaTitle}>{tripName}</Text>
                <Text style={styles.tripMetaDates}>📅 Oct {startDate} – Oct {endDate}, 2026 • Collaborative Draft</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setWizardStep(4);
                  setPlannerMode('wizard');
                }}
                style={styles.editWizardPill}
              >
                <Ionicons name="people-outline" size={12} color="#0D9488" />
                <Text style={styles.editWizardPillText}>Status ({completedCount}/4)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.alignmentSummaryStrip}>
              <View style={styles.summaryBadge}><Text style={styles.summaryBadgeText}>✨ Matched: #Chill & #CafeHopping</Text></View>
              <View style={styles.summaryBadge}><Text style={styles.summaryBadgeText}>🥗 #Halal Enforced</Text></View>
              <View style={styles.summaryBadge}><Text style={styles.summaryBadgeText}>💰 Cap: RM {stayLimit}/night</Text></View>
            </View>
          </View>

          <View style={styles.pollSectionCard}>
            <View style={styles.pollHeaderRow}>
              <View>
                <Text style={styles.pollSectionSub}>GROUP CONSENSUS POLL</Text>
                <Text style={styles.pollSectionTitle}>Vote On Route Variants</Text>
              </View>
              <View style={styles.activeVotePill}><Text style={styles.activeVoteText}>ACTIVE VOTE</Text></View>
            </View>

            {planVariants.map((variant) => (
              <TouchableOpacity
                key={variant.id}
                style={[styles.variantCard, variant.userVoted && styles.variantCardSelected]}
                onPress={() => handleVotePlan(variant.id)}
                activeOpacity={0.85}
              >
                <View style={styles.variantLeft}>
                  <Ionicons
                    name={variant.userVoted ? 'radio-button-on' : 'radio-button-off'}
                    size={18}
                    color={variant.userVoted ? '#0D9488' : '#9CA3AF'}
                  />
                  <View style={styles.flexOne}>
                    <Text style={[styles.variantName, variant.userVoted && styles.variantNameSelected]}>
                      {variant.name}
                    </Text>
                    <Text style={styles.variantTagline}>{variant.tagline}</Text>
                  </View>
                </View>

                <View style={[styles.voteCountPill, variant.userVoted && styles.voteCountPillSelected]}>
                  <Ionicons name="thumbs-up" size={11} color={variant.userVoted ? '#FFFFFF' : '#0D9488'} />
                  <Text style={[styles.voteCountNumber, variant.userVoted && styles.voteCountNumberSelected]}>
                    {variant.votes}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayScroll}>
            {[1, 2, 3, 4, 5].map((d) => (
              <TouchableOpacity
                key={d}
                onPress={() => setSelectedDay(d)}
                style={[styles.dayChip, selectedDay === d && styles.dayChipActive]}
              >
                <Text style={[styles.dayChipText, selectedDay === d && styles.dayChipTextActive]}>Day {d}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.stopsContainer}>
            {timelineStops.map((stop) => (
              <View key={stop.id} style={styles.stopCard}>
                <Image source={{ uri: stop.image }} style={styles.stopThumbnail} />
                <View style={styles.stopBody}>
                  <View style={styles.stopHeader}>
                    <View style={styles.timeBadge}><Text style={styles.timeBadgeText}>{stop.time}</Text></View>
                    <Text style={styles.stopCategoryBadge}>{stop.category}</Text>
                  </View>

                  <Text style={styles.stopTitle} numberOfLines={1}>{stop.title}</Text>
                  <Text style={styles.stopLocation} numberOfLines={1}>📍 {stop.location}</Text>

                  <View style={styles.metaRow}>
                    <View style={styles.ratingGroup}>
                      <Ionicons name="star" size={12} color="#F59E0B" />
                      <Text style={styles.ratingScore}>{stop.rating}★</Text>
                      <Text style={styles.reviewsCount}>({stop.reviews})</Text>
                    </View>
                    <Text style={styles.stopCost}>{stop.cost}</Text>
                  </View>

                  <View style={styles.stopVoteFooter}>
                    <Text style={styles.votePrompt}>Group reaction:</Text>
                    <View style={styles.reactionGroup}>
                      <TouchableOpacity
                        onPress={() => handleReactStop(stop.id, 'like')}
                        style={[styles.reactionBtn, stop.userReaction === 'like' && styles.reactionBtnLikeActive]}
                      >
                        <Ionicons name="thumbs-up" size={12} color={stop.userReaction === 'like' ? '#FFFFFF' : '#10B981'} />
                        <Text style={[styles.reactionText, stop.userReaction === 'like' && styles.reactionTextActive]}>
                          {stop.likes}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleReactStop(stop.id, 'dislike')}
                        style={[styles.reactionBtn, stop.userReaction === 'dislike' && styles.reactionBtnDislikeActive]}
                      >
                        <Ionicons name="thumbs-down" size={12} color={stop.userReaction === 'dislike' ? '#FFFFFF' : '#EF4444'} />
                        <Text style={[styles.reactionText, stop.userReaction === 'dislike' && styles.reactionTextActive]}>
                          {stop.dislikes}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.lockActionCard}>
            <View style={styles.lockTextGroup}>
              <Ionicons name="shield-checkmark-outline" size={24} color="#0D9488" />
              <View style={styles.flexOne}>
                <Text style={styles.lockActionTitle}>Confirm & Lock-in Itinerary</Text>
                <Text style={styles.lockActionSub}>
                  When all members agree, lock this plan to freeze edits and save it directly to the first page.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.lockButton}
              activeOpacity={0.88}
              onPress={() => {
                Alert.alert(
                  'Confirm & Lock Itinerary?',
                  'This transfers the confirmed itinerary to the Home page and enables full offline access.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Confirm & Save',
                      onPress: () => {
                        setPlannerMode('idle');
                        router.replace('/itinerary-detail');
                      },
                    },
                  ]
                );
              }}
            >
              <Ionicons name="lock-closed" size={16} color="#FFFFFF" />
              <Text style={styles.lockButtonText}>Confirm & Save Itinerary</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  flexOne: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  topBarHeading: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  discardBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  discardBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#EF4444',
  },

  /* WIZARD TOP BAR & PROGRESS */
  wizardTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  circleBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wizardTitleCenter: {
    alignItems: 'center',
  },
  wizardNavTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  wizardNavStepText: {
    fontSize: 11,
    color: '#0D9488',
    fontWeight: '700',
    marginTop: 1,
  },
  circleCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 3,
    backgroundColor: '#E5E7EB',
    width: '100%',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0D9488',
  },
  wizardScrollContent: {
    padding: 20,
    paddingBottom: 160,
  },
  fullScreenStepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  fullScreenStepDesc: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  fullScreenInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 6,
  },

  /* COLLAPSIBLE DATE BAR */
  dateSelectorBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  dateSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dateSelectorValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  durationBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },

  /* INTERACTIVE CALENDAR */
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
  },
  calendarMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarMonthTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  calendarPrompt: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0D9488',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  weekDayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    width: 36,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  emptyDayCell: {
    width: (width - 72) / 7,
    height: 38,
  },
  dayCell: {
    width: (width - 72) / 7,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    marginVertical: 2,
  },
  dayCellInRange: {
    backgroundColor: '#F0FDFA',
    borderRadius: 0,
  },
  dayCellSelected: {
    backgroundColor: '#0D9488',
    borderRadius: 19,
  },
  dayCellText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  dayCellTextInRange: {
    color: '#0D9488',
    fontWeight: '700',
  },
  dayCellTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  /* INVITE & SHARING */
  inviteShareBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDFA',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  inviteShareLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  inviteLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
  },
  inviteSubText: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  shareIconBtn: {
    backgroundColor: '#0D9488',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryNextBtn: {
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  primaryNextBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  /* TAGS */
  tagSectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  tagPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagPillActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  tagPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#374151',
  },
  tagPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* BUDGET CARDS */
  budgetCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
  },
  budgetCardHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  numberInputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currencyPrefix: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
    marginRight: 6,
  },
  numericTextInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    paddingVertical: 8,
  },
  unitSuffix: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  transitToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  prefChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  prefChipActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  prefChipText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#4B5563',
  },
  prefChipTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },

  /* MEMBER STATUS & READINESS (STEP 4) */
  membersStatusBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  membersStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBoxTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
  },
  statusBoxPct: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
  },
  memberStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3F4F6',
    gap: 10,
  },
  memberAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  memberNameText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  memberStatusDone: {
    fontSize: 10,
    color: '#0D9488',
    fontWeight: '600',
    marginTop: 1,
  },
  memberStatusPending: {
    fontSize: 10,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 1,
  },
  nudgeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  nudgeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#B45309',
  },
  checkedCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingNoticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 12,
  },
  pendingNoticeText: {
    fontSize: 11,
    color: '#92400E',
    flex: 1,
    lineHeight: 16,
  },
  consensusBox: {
    backgroundColor: '#EEF2FF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 14,
  },
  consensusHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4338CA',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  consensusTag: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  consensusTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  consensusNotes: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 16,
    marginTop: 4,
  },
  applyItineraryBtn: {
    backgroundColor: '#0D9488',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 6,
  },
  applyItineraryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  twoBtnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },
  prevBtn: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevBtnText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '700',
  },
  nextStepBtnFlex: {
    flex: 1,
    backgroundColor: '#111827',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* IDLE VIEW */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  emptyIllustrationBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  emptySparkleBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#0D9488',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 26,
  },
  createMainBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0D9488',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 16,
    shadowColor: '#0D9488',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  createMainBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  /* DRAFT ITINERARY VIEW */
  tripMetaCard: {
    backgroundColor: '#0F172A',
    margin: 16,
    borderRadius: 20,
    padding: 16,
  },
  tripMetaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tripMetaLocation: {
    color: '#2DD4BF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  tripMetaTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 2,
  },
  tripMetaDates: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  editWizardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  editWizardPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  alignmentSummaryStrip: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  summaryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  summaryBadgeText: {
    color: '#F1F5F9',
    fontSize: 10,
    fontWeight: '600',
  },
  pollSectionCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  pollHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pollSectionSub: {
    fontSize: 9,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.5,
  },
  pollSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginTop: 1,
  },
  activeVotePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeVoteText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  variantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  variantCardSelected: {
    backgroundColor: '#F0FDFA',
    borderColor: '#0D9488',
  },
  variantLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    marginRight: 10,
  },
  variantName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  variantNameSelected: {
    color: '#0D9488',
    fontWeight: '800',
  },
  variantTagline: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  voteCountPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  voteCountPillSelected: {
    backgroundColor: '#0D9488',
  },
  voteCountNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0D9488',
  },
  voteCountNumberSelected: {
    color: '#FFFFFF',
  },
  dayScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  dayChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayChipActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  dayChipTextActive: {
    color: '#FFFFFF',
  },
  stopsContainer: {
    paddingHorizontal: 16,
    gap: 12,
  },
  stopCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stopThumbnail: {
    width: 90,
    height: '100%',
    backgroundColor: '#E5E7EB',
  },
  stopBody: {
    flex: 1,
    padding: 12,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timeBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  stopCategoryBadge: {
    fontSize: 9,
    fontWeight: '600',
    color: '#6B7280',
  },
  stopTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  stopLocation: {
    fontSize: 10,
    color: '#6B7280',
    marginTop: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingScore: {
    fontSize: 11,
    fontWeight: '800',
    color: '#111827',
  },
  reviewsCount: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  stopCost: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  stopVoteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#F3F4F6',
  },
  votePrompt: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  reactionGroup: {
    flexDirection: 'row',
    gap: 6,
  },
  reactionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  reactionBtnLikeActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  reactionBtnDislikeActive: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  reactionText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#4B5563',
  },
  reactionTextActive: {
    color: '#FFFFFF',
  },
  lockActionCard: {
    backgroundColor: '#0F172A',
    margin: 16,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  lockTextGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  lockActionTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  lockActionSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    lineHeight: 16,
  },
  lockButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#0D9488',
    paddingVertical: 13,
    borderRadius: 14,
  },
  lockButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});