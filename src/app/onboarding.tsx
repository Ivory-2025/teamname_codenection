import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
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

const VIBE_TAGS = [
  { id: '1', label: '#Chill', category: 'Pace' },
  { id: '2', label: '#FastPaced', category: 'Pace' },
  { id: '3', label: '#SleepIn', category: 'Pace' },
  { id: '4', label: '#PackTheDay', category: 'Pace' },
  { id: '5', label: '#Adventure', category: 'Style' },
  { id: '6', label: '#CafeHopping', category: 'Style' },
  { id: '7', label: '#Culture', category: 'Style' },
  { id: '8', label: '#Nightlife', category: 'Style' },
  { id: '9', label: '#Halal', category: 'Diet' },
  { id: '10', label: '#Vegetarian', category: 'Diet' },
  { id: '11', label: '#StreetFood', category: 'Diet' },
];

export default function GroupOnboardingScreen() {
  const router = useRouter();

  // Navigation steps: 1 = Invite, 2 = Preference & Budget, 3 = Group Benchmark
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Preference states
  const [selectedTags, setSelectedTags] = useState<string[]>(['#CafeHopping', '#Chill']);
  const [stayBudget, setStayBudget] = useState<string>('250');
  const [transitMode, setTransitMode] = useState<'public' | 'grab'>('public');
  const [transitCap, setTransitCap] = useState<string>('40');
  const [dailyLiving, setDailyLiving] = useState<string>('120');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      if (selectedTags.length >= 5) {
        Alert.alert('Tag Limit Reached', 'You can pick up to 5 vibe tags.');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleShareInvite = async () => {
    try {
      await Share.share({
        message: 'Join our trip workspace on Escape: app.escape.io/join/kansai-2026',
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Header & Step Switcher */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => (currentStep > 1 ? setCurrentStep((currentStep - 1) as 1 | 2) : router.back())}
          style={styles.circleBackBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={18} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.screenHeaderTitle}>Trip Alignment Hub</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Step Indicator Tabs */}
      <View style={styles.stepTabsRow}>
        {[
          { step: 1, label: '1. Invite' },
          { step: 2, label: '2. Preferences' },
          { step: 3, label: '3. Benchmark' },
        ].map((item) => (
          <TouchableOpacity
            key={item.step}
            onPress={() => setCurrentStep(item.step as 1 | 2 | 3)}
            style={[styles.stepTabChip, currentStep === item.step && styles.stepTabChipActive]}
          >
            <Text style={[styles.stepTabText, currentStep === item.step && styles.stepTabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ========================================================================= */}
        {/* 1. INVITE SHEET & QR CODE                                                 */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <View style={styles.cardContainer}>
            <View style={styles.sheetPill} />
            <Text style={styles.sectionSubtitle}>COLLABORATIVE WORKSPACE</Text>
            <Text style={styles.cardTitle}>Invite Travel Buddies</Text>
            <View style={styles.tripBadge}>
              <Text style={styles.tripBadgeText}>✈️ Autumn in Kansai • Oct 14–22, 2026</Text>
            </View>

            {/* QR Code Container */}
            <View style={styles.qrContainer}>
              <Ionicons name="qr-code" size={120} color="#0F172A" />
              <Text style={styles.qrSubtext}>Scan with camera or Expo Go to join</Text>
            </View>

            {/* Copy Link Row */}
            <View style={styles.linkBar}>
              <Ionicons name="link-outline" size={16} color="#6B7280" />
              <Text style={styles.linkText} numberOfLines={1}>
                app.escape.io/join/kansai-2026
              </Text>
              <TouchableOpacity
                style={styles.copyButton}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Link Copied', 'Invite link copied to clipboard!')}
              >
                <Text style={styles.copyButtonText}>Copy</Text>
              </TouchableOpacity>
            </View>

            {/* Primary Share CTA */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={handleShareInvite}
            >
              <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
              <Text style={styles.primaryBtnText}>Share via WhatsApp / Messages</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ghostLinkBtn}
              onPress={() => setCurrentStep(2)}
            >
              <Text style={styles.ghostLinkText}>Continue to Vibe Calibration →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* 2. TAG SELECTOR GRID & 3-TIER BUDGET SLIDER/INPUT CARDS                   */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <View>
            {/* Interactive Tag Grid */}
            <View style={styles.cardContainer}>
              <Text style={styles.cardTitle}>What's your trip vibe?</Text>
              <Text style={styles.cardDesc}>
                Select up to 5 tags to calibrate AI suggestions ({selectedTags.length}/5).
              </Text>

              <View style={styles.tagGrid}>
                {VIBE_TAGS.map((tag) => {
                  const isActive = selectedTags.includes(tag.label);
                  return (
                    <TouchableOpacity
                      key={tag.id}
                      onPress={() => toggleTag(tag.label)}
                      style={[styles.tagChip, isActive && styles.tagChipActive]}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.tagChipText, isActive && styles.tagChipTextActive]}>
                        {tag.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3-Tier Budget Cards */}
            <Text style={styles.groupHeading}>3-TIER BUDGET CALIBRATION</Text>

            {/* 1. Stay Limit Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="bed-outline" size={18} color="#0D9488" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.budgetCardTitle}>Nightly Stay Limit</Text>
                  <Text style={styles.budgetCardSub}>Hotel or Airbnb ceiling per person[cite: 1]</Text>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>RM</Text>
                <TextInput
                  value={stayBudget}
                  onChangeText={setStayBudget}
                  keyboardType="numeric"
                  style={styles.numericInput}
                  placeholder="250"
                />
                <Text style={styles.inputUnit}>/ night</Text>
              </View>

              <View style={styles.presetRow}>
                {['150', '250', '400'].map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => setStayBudget(preset)}
                    style={[styles.presetChip, stayBudget === preset && styles.presetChipActive]}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        stayBudget === preset && styles.presetChipTextActive,
                      ]}
                    >
                      RM {preset}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 2. Transit Cap & Mode Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="car-outline" size={18} color="#0D9488" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.budgetCardTitle}>Daily Transit Cap</Text>
                  <Text style={styles.budgetCardSub}>Select mode & daily spending limit[cite: 1]</Text>
                </View>
              </View>

              <View style={styles.toggleRow}>
                <TouchableOpacity
                  onPress={() => setTransitMode('public')}
                  style={[styles.toggleBtn, transitMode === 'public' && styles.toggleBtnActive]}
                >
                  <Ionicons
                    name="subway-outline"
                    size={14}
                    color={transitMode === 'public' ? '#0D9488' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      transitMode === 'public' && styles.toggleBtnTextActive,
                    ]}
                  >
                    Train / Bus
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setTransitMode('grab')}
                  style={[styles.toggleBtn, transitMode === 'grab' && styles.toggleBtnActive]}
                >
                  <Ionicons
                    name="car-sport-outline"
                    size={14}
                    color={transitMode === 'grab' ? '#0D9488' : '#6B7280'}
                  />
                  <Text
                    style={[
                      styles.toggleBtnText,
                      transitMode === 'grab' && styles.toggleBtnTextActive,
                    ]}
                  >
                    Grab / Taxi
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>RM</Text>
                <TextInput
                  value={transitCap}
                  onChangeText={setTransitCap}
                  keyboardType="numeric"
                  style={styles.numericInput}
                  placeholder="40"
                />
                <Text style={styles.inputUnit}>/ day cap</Text>
              </View>
            </View>

            {/* 3. Daily Meal Allowance Card */}
            <View style={styles.cardContainer}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="restaurant-outline" size={18} color="#0D9488" />
                </View>
                <View style={styles.flexOne}>
                  <Text style={styles.budgetCardTitle}>Daily Meal Allowance</Text>
                  <Text style={styles.budgetCardSub}>Food, coffee, & attraction tickets[cite: 1]</Text>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.currencyPrefix}>RM</Text>
                <TextInput
                  value={dailyLiving}
                  onChangeText={setDailyLiving}
                  keyboardType="numeric"
                  style={styles.numericInput}
                  placeholder="120"
                />
                <Text style={styles.inputUnit}>/ person / day</Text>
              </View>

              <Text style={styles.breakdownNotice}>
                💡 Est. RM 35 Lunch • RM 60 Dinner • RM 25 Snacks/Tickets
              </Text>
            </View>

            {/* Save CTA */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => setCurrentStep(3)}
            >
              <Text style={styles.primaryBtnText}>Confirm Preferences & View Benchmark →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ========================================================================= */}
        {/* 3. GROUP BENCHMARK CARD (VIBE SUMMARY & BUDGET CEILINGS)                  */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <View style={styles.cardContainer}>
            <View style={styles.benchmarkHeader}>
              <View>
                <Text style={styles.benchmarkTitle}>Group Alignment Benchmark</Text>
                <Text style={styles.benchmarkSub}>4 of 4 Travel Members Synced[cite: 1]</Text>
              </View>
              <View style={styles.syncedPill}>
                <Ionicons name="checkmark-circle" size={12} color="#0D9488" />
                <Text style={styles.syncedPillText}>Aligned</Text>
              </View>
            </View>

            {/* Collective Vibe Match */}
            <View style={styles.vibeCard}>
              <Text style={styles.vibeCardTitle}>🔥 COLLECTIVE VIBE MATCH[cite: 1]</Text>
              <View style={styles.tagWrapRow}>
                <View style={styles.matchedTag}>
                  <Text style={styles.matchedTagText}>#CafeHopping (4/4)</Text>
                </View>
                <View style={styles.matchedTag}>
                  <Text style={styles.matchedTagText}>#Chill (3/4)</Text>
                </View>
                <View style={styles.matchedTag}>
                  <Text style={styles.matchedTagText}>#Halal (2/4)</Text>
                </View>
              </View>
              <Text style={styles.vibeInsight}>
                "The group favors relaxed starts, specialty coffee spots, and certified Halal dining."
              </Text>
            </View>

            {/* Agreed Budget Ceilings */}
            <Text style={styles.budgetCeilingHeading}>AGREED GROUP BUDGET CEILINGS[cite: 1]</Text>

            {/* Stay Ceiling */}
            <View style={styles.ceilingRow}>
              <View style={styles.ceilingLabelRow}>
                <Text style={styles.ceilingLabel}>Accommodation / Night</Text>
                <Text style={styles.ceilingValue}>RM 200 - RM 300</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '75%' }]} />
              </View>
              <Text style={styles.ceilingSubtext}>Group Average: RM 240 / night[cite: 1]</Text>
            </View>

            {/* Transit Ceiling */}
            <View style={styles.ceilingRow}>
              <View style={styles.ceilingLabelRow}>
                <Text style={styles.ceilingLabel}>Transit Preference</Text>
                <Text style={styles.ceilingHighlight}>🚆 Public Transit Preferred</Text>
              </View>
              <Text style={styles.ceilingSubtext}>Group Cap: RM 35 / day per person[cite: 1]</Text>
            </View>

            {/* Daily Meals Ceiling */}
            <View style={styles.ceilingRow}>
              <View style={styles.ceilingLabelRow}>
                <Text style={styles.ceilingLabel}>Daily Food & Tickets</Text>
                <Text style={styles.ceilingValue}>RM 100 - RM 150</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '60%' }]} />
              </View>
              <Text style={styles.ceilingSubtext}>Balanced budget for shared dining[cite: 1]</Text>
            </View>

            {/* Active AI Recommendation Rules */}
            <View style={styles.ruleBox}>
              <Text style={styles.ruleTitle}>💡 AUTOMATED RECOMMENDATION RULES APPLIED[cite: 1]</Text>
              <Text style={styles.ruleText}>• Excludes stays above RM 300/night ceiling[cite: 1]</Text>
              <Text style={styles.ruleText}>• Enforces Halal/Muslim-friendly dining options[cite: 1]</Text>
              <Text style={styles.ruleText}>• Prioritizes walking & subway routes to save costs[cite: 1]</Text>
            </View>

            {/* Finish CTA */}
            <TouchableOpacity
              style={styles.primaryBtn}
              activeOpacity={0.85}
              onPress={() => router.push('/itinerary-detail')}
            >
              <Text style={styles.primaryBtnText}>Open Shared Itinerary →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  circleBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  stepTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  stepTabChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
  },
  stepTabChipActive: {
    backgroundColor: '#0D9488',
  },
  stepTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  stepTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  sheetPill: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: '#0D9488',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginTop: 4,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 16,
    textAlign: 'center',
  },
  tripBadge: {
    alignSelf: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  tripBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  qrContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginVertical: 18,
  },
  qrSubtext: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 10,
  },
  linkBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    color: '#4B5563',
    marginHorizontal: 8,
  },
  copyButton: {
    backgroundColor: '#CCFBF1',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  primaryBtn: {
    backgroundColor: '#111827',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 4,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  ghostLinkBtn: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 4,
  },
  ghostLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagChipActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  tagChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  tagChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  groupHeading: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: '#6B7280',
    marginVertical: 10,
    marginLeft: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexOne: {
    flex: 1,
  },
  budgetCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  budgetCardSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
    marginRight: 6,
  },
  numericInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    padding: 0,
  },
  inputUnit: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  presetRow: {
    flexDirection: 'row',
    gap: 8,
  },
  presetChip: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  presetChipActive: {
    backgroundColor: '#CCFBF1',
    borderWidth: 1,
    borderColor: '#0D9488',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  presetChipTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  toggleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleBtnActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  toggleBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  toggleBtnTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  breakdownNotice: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  benchmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  benchmarkTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  benchmarkSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  syncedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  syncedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
  },
  vibeCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 16,
  },
  vibeCardTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  tagWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  matchedTag: {
    backgroundColor: '#0D9488',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  matchedTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  vibeInsight: {
    fontSize: 11,
    color: '#374151',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  budgetCeilingHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
    marginBottom: 12,
  },
  ceilingRow: {
    marginBottom: 14,
  },
  ceilingLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ceilingLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  ceilingValue: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111827',
  },
  ceilingHighlight: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0D9488',
    borderRadius: 3,
  },
  ceilingSubtext: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  ruleBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 6,
    marginBottom: 16,
  },
  ruleTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4B5563',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  ruleText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 18,
  },
});