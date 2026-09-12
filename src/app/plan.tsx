import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const OCTOBER_DAYS = [
  null, null, null, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31,
];

const TAG_CATEGORIES = {
  style: [
    { id: 't1', label: '#Chill' },
    { id: 't2', label: '#Adventure' },
    { id: 't3', label: '#CafeHopping' },
    { id: 't4', label: '#Culture' },
    { id: 't5', label: '#Photography' },
    { id: 't6', label: '#Shopping' },
  ],
  pace: [
    { id: 'p1', label: '#SleepIn' },
    { id: 'p2', label: '#FastPaced' },
    { id: 'p3', label: '#Balanced' },
  ],
  diet: [
    { id: 'd1', label: '#Halal' },
    { id: 'd2', label: '#Vegetarian' },
    { id: 'd3', label: '#Vegan' },
  ],
};

export default function AIPlannerScreen() {
  const router = useRouter();

  const [plannerMode, setPlannerMode] = useState<'idle' | 'wizard'>('idle');
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);

  const [tripType, setTripType] = useState<'Group' | 'Solo'>('Group');
  const [tripName, setTripName] = useState('Autumn in Kansai');
  const [destination, setDestination] = useState('Kyoto & Osaka, Japan');

  const [showCalendar, setShowCalendar] = useState(false);
  const [startDate, setStartDate] = useState<number>(14);
  const [endDate, setEndDate] = useState<number>(20);

  const [selectedTags, setSelectedTags] = useState<string[]>(['#Chill', '#CafeHopping', '#Halal']);
  const [stayLimit, setStayLimit] = useState('250');

  const handleDatePress = (day: number) => {
    if (day < startDate) {
      setStartDate(day);
      setEndDate(day + 3);
    } else {
      setEndDate(day);
    }
  };

  const toggleTag = (label: string) => {
    if (selectedTags.includes(label)) {
      setSelectedTags(selectedTags.filter((t) => t !== label));
    } else {
      setSelectedTags([...selectedTags, label]);
    }
  };

  const handleFinishWizard = () => {
    setPlannerMode('idle');
    router.push({
      pathname: '/BookingSelectionScreen',
      params: { mode: tripType === 'Solo' ? 'solo' : 'group' },
    } as any);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Ionicons name="sparkles" size={18} color="#0D9488" />
          <Text style={styles.topBarHeading}>AI Trip Manager</Text>
        </View>
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
            Configure your trip preferences, pick dates on the calendar, set your budget limits, and generate a customized route.
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
            <Text style={styles.createMainBtnText}>Start Travel Planner</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.flexOne}>
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
              <Text style={styles.wizardNavStepText}>Step {wizardStep} of 3</Text>
            </View>

            <TouchableOpacity onPress={() => setPlannerMode('idle')} style={styles.circleCloseBtn}>
              <Ionicons name="close" size={20} color="#4B5563" />
            </TouchableOpacity>
          </View>

          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${(wizardStep / 3) * 100}%` }]} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.wizardScrollContent}>
            {wizardStep === 1 && (
              <View>
                <Text style={styles.stepTitle}>Who is Traveling & When?</Text>
                <Text style={styles.stepDesc}>
                  Select Solo if planning alone, or Group to invite travel buddies for collaborative polling.
                </Text>

                <Text style={styles.fieldLabel}>TRAVEL MODE</Text>
                <View style={styles.modeToggleContainer}>
                  <TouchableOpacity
                    style={[styles.modeCard, tripType === 'Solo' && styles.modeCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setTripType('Solo')}
                  >
                    <View style={[styles.modeIconCircle, tripType === 'Solo' && styles.modeIconCircleActive]}>
                      <Ionicons name="person" size={20} color={tripType === 'Solo' ? '#FFFFFF' : '#4B5563'} />
                    </View>
                    <Text style={[styles.modeTitle, tripType === 'Solo' && styles.modeTitleActive]}>Solo Trip</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modeCard, tripType === 'Group' && styles.modeCardActive]}
                    activeOpacity={0.8}
                    onPress={() => setTripType('Group')}
                  >
                    <View style={[styles.modeIconCircle, tripType === 'Group' && styles.modeIconCircleActive]}>
                      <Ionicons name="people" size={20} color={tripType === 'Group' ? '#FFFFFF' : '#4B5563'} />
                    </View>
                    <Text style={[styles.modeTitle, tripType === 'Group' && styles.modeTitleActive]}>Group Trip</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.fieldLabel}>TRIP NAME</Text>
                <TextInput value={tripName} onChangeText={setTripName} style={styles.fullScreenInput} />

                <Text style={styles.fieldLabel}>DESTINATION</Text>
                <TextInput value={destination} onChangeText={setDestination} style={styles.fullScreenInput} />

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
                    <Ionicons name={showCalendar ? 'chevron-up' : 'chevron-down'} size={14} color="#0D9488" />
                  </View>
                </TouchableOpacity>

                {showCalendar && (
                  <View style={styles.calendarContainer}>
                    <View style={styles.calendarMonthHeader}>
                      <Text style={styles.calendarMonthTitle}>October 2026</Text>
                      <Text style={styles.calendarPrompt}>Select date range</Text>
                    </View>
                    <View style={styles.weekDaysRow}>
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, idx) => (
                        <Text key={idx} style={styles.weekDayLabel}>{w}</Text>
                      ))}
                    </View>
                    <View style={styles.daysGrid}>
                      {OCTOBER_DAYS.map((day, idx) => {
                        if (day === null) return <View key={idx} style={styles.emptyDayCell} />;
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

                <TouchableOpacity style={styles.primaryNextBtn} onPress={() => setWizardStep(2)}>
                  <Text style={styles.primaryNextBtnText}>Next: Style & Diet Tags →</Text>
                </TouchableOpacity>
              </View>
            )}

            {wizardStep === 2 && (
              <View>
                <Text style={styles.stepTitle}>Travel Vibes & Preferences</Text>
                <Text style={styles.stepDesc}>Select your tags so AI matches your style.</Text>

                <Text style={styles.tagSectionLabel}>TRAVEL STYLE</Text>
                <View style={styles.tagWrap}>
                  {TAG_CATEGORIES.style.map((tag) => (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagPill, selectedTags.includes(tag.label) && styles.tagPillActive]}
                    >
                      <Text style={[styles.tagPillText, selectedTags.includes(tag.label) && styles.tagPillTextActive]}>
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.tagSectionLabel}>DAILY PACE</Text>
                <View style={styles.tagWrap}>
                  {TAG_CATEGORIES.pace.map((tag) => (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagPill, selectedTags.includes(tag.label) && styles.tagPillActive]}
                    >
                      <Text style={[styles.tagPillText, selectedTags.includes(tag.label) && styles.tagPillTextActive]}>
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.tagSectionLabel}>DIETARY RESTRICTIONS</Text>
                <View style={styles.tagWrap}>
                  {TAG_CATEGORIES.diet.map((tag) => (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagPill, selectedTags.includes(tag.label) && styles.tagPillActive]}
                    >
                      <Text style={[styles.tagPillText, selectedTags.includes(tag.label) && styles.tagPillTextActive]}>
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
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

            {wizardStep === 3 && (
              <View>
                <Text style={styles.stepTitle}>Budget Ceilings</Text>
                <Text style={styles.stepDesc}>Enter limits to filter flight and hotel recommendations.</Text>

                <View style={styles.budgetCard}>
                  <Text style={styles.budgetCardHeading}>🏨 Stay Cap (Per Night)</Text>
                  <View style={styles.numberInputBar}>
                    <Text style={styles.currencyPrefix}>RM</Text>
                    <TextInput value={stayLimit} onChangeText={setStayLimit} keyboardType="numeric" style={styles.numericTextInput} />
                  </View>
                </View>

                <View style={styles.twoBtnRow}>
                  <TouchableOpacity style={styles.prevBtn} onPress={() => setWizardStep(2)}>
                    <Text style={styles.prevBtnText}>Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.nextStepBtnFlex} onPress={handleFinishWizard}>
                    <Text style={styles.primaryNextBtnText}>Proceed to AI Flight/Stay Match →</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  flexOne: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  topBarHeading: { fontSize: 16, fontWeight: '800', color: '#111827' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 28 },
  emptyIllustrationBox: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#CCFBF1', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  emptySparkleBadge: { position: 'absolute', top: 6, right: 6, backgroundColor: '#0D9488', width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: '#111827', textAlign: 'center' },
  emptySubtitle: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginTop: 8, marginBottom: 26 },
  createMainBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0D9488', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 16 },
  createMainBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  wizardTopBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#FFFFFF' },
  circleBackBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  wizardTitleCenter: { alignItems: 'center' },
  wizardNavTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  wizardNavStepText: { fontSize: 11, color: '#0D9488', fontWeight: '700', marginTop: 1 },
  circleCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center' },
  progressTrack: { height: 3, backgroundColor: '#E5E7EB', width: '100%' },
  progressFill: { height: '100%', backgroundColor: '#0D9488' },
  wizardScrollContent: { padding: 20, paddingBottom: 160 },
  stepTitle: { fontSize: 20, fontWeight: '800', color: '#111827' },
  stepDesc: { fontSize: 13, color: '#6B7280', lineHeight: 19, marginTop: 4, marginBottom: 16 },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginTop: 10, marginBottom: 6 },
  modeToggleContainer: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  modeCard: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  modeCardActive: { borderColor: '#0D9488', backgroundColor: '#F0FDFA' },
  modeIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  modeIconCircleActive: { backgroundColor: '#0D9488' },
  modeTitle: { fontSize: 13, fontWeight: '700', color: '#374151' },
  modeTitleActive: { color: '#0D9488', fontWeight: '800' },
  fullScreenInput: { backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, fontWeight: '600', color: '#111827', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 6 },
  dateSelectorBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 8 },
  dateSelectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dateSelectorValue: { fontSize: 14, fontWeight: '700', color: '#111827' },
  durationBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#CCFBF1', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  durationBadgeText: { fontSize: 11, fontWeight: '700', color: '#0D9488' },
  calendarContainer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 14 },
  calendarMonthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  calendarMonthTitle: { fontSize: 15, fontWeight: '800', color: '#111827' },
  calendarPrompt: { fontSize: 11, fontWeight: '600', color: '#0D9488' },
  weekDaysRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  weekDayLabel: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', width: 36, textAlign: 'center' },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' },
  emptyDayCell: { width: (width - 72) / 7, height: 38 },
  dayCell: { width: (width - 72) / 7, height: 38, alignItems: 'center', justifyContent: 'center', borderRadius: 19, marginVertical: 2 },
  dayCellInRange: { backgroundColor: '#F0FDFA', borderRadius: 0 },
  dayCellSelected: { backgroundColor: '#0D9488', borderRadius: 19 },
  dayCellText: { fontSize: 13, fontWeight: '600', color: '#374151' },
  dayCellTextInRange: { color: '#0D9488', fontWeight: '700' },
  dayCellTextSelected: { color: '#FFFFFF', fontWeight: '800' },
  primaryNextBtn: { backgroundColor: '#111827', paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  primaryNextBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },
  tagSectionLabel: { fontSize: 10, fontWeight: '800', color: '#6B7280', letterSpacing: 0.5, marginTop: 10, marginBottom: 6 },
  tagWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tagPill: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 14, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB' },
  tagPillActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  tagPillText: { fontSize: 11, fontWeight: '600', color: '#374151' },
  tagPillTextActive: { color: '#FFFFFF', fontWeight: '700' },
  budgetCard: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 10 },
  budgetCardHeading: { fontSize: 11, fontWeight: '700', color: '#374151', marginBottom: 8 },
  numberInputBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 10, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  currencyPrefix: { fontSize: 13, fontWeight: '700', color: '#6B7280', marginRight: 6 },
  numericTextInput: { flex: 1, fontSize: 15, fontWeight: '800', color: '#111827', paddingVertical: 8 },
  twoBtnRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  prevBtn: { paddingVertical: 12, paddingHorizontal: 18, borderRadius: 14, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' },
  prevBtnText: { color: '#4B5563', fontSize: 12, fontWeight: '700' },
  nextStepBtnFlex: { flex: 1, backgroundColor: '#111827', paddingVertical: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
});