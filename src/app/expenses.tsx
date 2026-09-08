import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

// 1 JPY = 0.031 MYR approx exchange rate
const JPY_TO_MYR_RATE = 0.031;

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
}

const MEMBERS: GroupMember[] = [
  { id: '1', name: 'Ivory (You)', avatar: '👤' },
  { id: '2', name: 'Chin Jie', avatar: '🦁' },
  { id: '3', name: 'ZhiHeng', avatar: '🐼' },
  { id: '4', name: 'Sarah', avatar: '🦊' },
];

interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  paidBy: string;
  amountLocal: number;
  currencyLocal: 'JPY' | 'MYR';
  amountMYR: number;
  splitCount: number;
  date: string;
  receiptAttached?: boolean;
}

const SAMPLE_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp-1',
    title: 'Nishiki Market Seafood Feast',
    category: 'Dining',
    paidBy: 'Ivory (You)',
    amountLocal: 9800,
    currencyLocal: 'JPY',
    amountMYR: 303.8,
    splitCount: 4,
    date: 'Oct 14, 2026',
    receiptAttached: true,
  },
  {
    id: 'exp-2',
    title: 'Kyoto Sightseeing Taxi',
    category: 'Transit',
    paidBy: 'Chin Jie',
    amountLocal: 3200,
    currencyLocal: 'JPY',
    amountMYR: 99.2,
    splitCount: 4,
    date: 'Oct 14, 2026',
    receiptAttached: false,
  },
  {
    id: 'exp-3',
    title: 'Bamboo Grove Souvenirs & Matcha',
    category: 'Shopping',
    paidBy: 'ZhiHeng',
    amountLocal: 4500,
    currencyLocal: 'JPY',
    amountMYR: 139.5,
    splitCount: 2,
    date: 'Oct 15, 2026',
    receiptAttached: true,
  },
];

export default function ExpenseManagerScreen() {
  const router = useRouter();

  // Tab: 'ledger' | 'smart-settle'
  const [activeTab, setActiveTab] = useState<'ledger' | 'smart-settle'>('ledger');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for "Add Expense"
  const [expenseTitle, setExpenseTitle] = useState('');
  const [inputAmount, setInputAmount] = useState('4500');
  const [currency, setCurrency] = useState<'JPY' | 'MYR'>('JPY');
  const [splitMode, setSplitMode] = useState<'equal' | 'custom'>('equal');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(['1', '2', '3', '4']);
  const [receiptScanned, setReceiptScanned] = useState(false);

  const numericAmount = parseFloat(inputAmount) || 0;
  const convertedAmount =
    currency === 'JPY'
      ? (numericAmount * JPY_TO_MYR_RATE).toFixed(2)
      : (numericAmount / JPY_TO_MYR_RATE).toFixed(0);

  const handleBack = () => {
    router.replace('/itinerary-detail');
  };

  const toggleMemberSelection = (id: string) => {
    if (selectedMemberIds.includes(id)) {
      if (selectedMemberIds.length === 1) {
        Alert.alert('Required', 'At least one person must be part of the split.');
        return;
      }
      setSelectedMemberIds(selectedMemberIds.filter((m) => m !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSimulateReceiptScan = () => {
    setReceiptScanned(true);
    setExpenseTitle('Gion Kaiseki Dinner');
    setInputAmount('14200');
    setCurrency('JPY');
    Alert.alert('Receipt Scanned ✨', 'Extracted ¥14,200 for "Gion Kaiseki Dinner" via OCR.');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={handleBack} style={styles.circleBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Shared Expense Ledger</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)} style={styles.addBtnHeader}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Main Switcher (Ledger vs. Smart Settle) */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('ledger')}
          style={[styles.tabButton, activeTab === 'ledger' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'ledger' && styles.tabButtonTextActive]}>
            Trip Feed & Ledger
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('smart-settle')}
          style={[styles.tabButton, activeTab === 'smart-settle' && styles.tabButtonActive]}
        >
          <Text style={[styles.tabButtonText, activeTab === 'smart-settle' && styles.tabButtonTextActive]}>
            ⚡ Smart Settle
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* VIEW 1: EXPENSE LEDGER & SPENDING OVERVIEW */}
        {activeTab === 'ledger' && (
          <View>
            {/* Total Balance Card */}
            <View style={styles.heroBalanceCard}>
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceHeaderTitle}>TOTAL GROUP EXPENSES</Text>
                <View style={styles.currencyPill}>
                  <Text style={styles.currencyPillText}>Live FX: 1 JPY ≈ 0.031 MYR</Text>
                </View>
              </View>

              <Text style={styles.balanceLarge}>RM 542.50</Text>
              <Text style={styles.balanceSub}>Equivalent to ~¥17,500 across 3 records</Text>

              <View style={styles.balanceStatsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Your Share</Text>
                  <Text style={styles.statValue}>RM 142.10</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>You are Owed</Text>
                  <Text style={styles.statValueGreen}>+ RM 161.70</Text>
                </View>
              </View>
            </View>

            {/* Quick Action Trigger */}
            <TouchableOpacity
              style={styles.quickAddCard}
              activeOpacity={0.85}
              onPress={() => setShowAddModal(true)}
            >
              <View style={styles.quickAddIcon}>
                <Ionicons name="camera" size={18} color="#0D9488" />
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.quickAddTitle}>Add Expense or Scan Receipt</Text>
                <Text style={styles.quickAddSub}>Auto-converts foreign currencies & splits bill</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>

            {/* Expense History List */}
            <Text style={styles.sectionHeading}>RECENT TRANSACTIONS</Text>

            {SAMPLE_EXPENSES.map((item) => (
              <View key={item.id} style={styles.expenseItemCard}>
                <View style={styles.expenseIconBox}>
                  <Ionicons
                    name={
                      item.category === 'Dining'
                        ? 'restaurant-outline'
                        : item.category === 'Transit'
                        ? 'car-outline'
                        : 'bag-handle-outline'
                    }
                    size={20}
                    color="#0D9488"
                  />
                </View>

                <View style={styles.expenseDetails}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.expenseTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.expenseAmountMYR}>RM {item.amountMYR.toFixed(2)}</Text>
                  </View>

                  <View style={styles.rowBetween}>
                    <Text style={styles.expenseMeta}>
                      Paid by <Text style={styles.boldDark}>{item.paidBy}</Text> • {item.splitCount} pax split
                    </Text>
                    <Text style={styles.expenseOriginalCurrency}>
                      ¥{item.amountLocal.toLocaleString()}
                    </Text>
                  </View>

                  {item.receiptAttached && (
                    <View style={styles.receiptAttachedTag}>
                      <Ionicons name="receipt-outline" size={11} color="#0D9488" />
                      <Text style={styles.receiptAttachedText}>Receipt Verified</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* VIEW 2: "SMART SETTLE" DEBT SIMPLIFICATION CARDS */}
        {activeTab === 'smart-settle' && (
          <View>
            <View style={styles.smartSettleBanner}>
              <View style={styles.smartSettleIconCircle}>
                <Ionicons name="flash" size={20} color="#4338CA" />
              </View>
              <View style={styles.flexOne}>
                <Text style={styles.smartSettleBannerTitle}>Smart Settle Algorithm</Text>
                <Text style={styles.smartSettleBannerSub}>
                  Minimizes transactions from 7 confusing criss-cross debts down to just 2 direct settlements.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionHeading}>MINIMUM TRANSFERS NEEDED</Text>

            {/* Transfer Card 1 */}
            <View style={styles.transferCard}>
              <View style={styles.transferPathRow}>
                <View style={styles.memberNode}>
                  <Text style={styles.avatarEmoji}>🐼</Text>
                  <Text style={styles.memberName}>ZhiHeng</Text>
                  <Text style={styles.memberRole}>Sender</Text>
                </View>

                <View style={styles.transferArrowBox}>
                  <Text style={styles.transferAmountTag}>RM 86.40</Text>
                  <Ionicons name="arrow-forward" size={18} color="#0D9488" />
                  <Text style={styles.transferMethodText}>Direct Transfer</Text>
                </View>

                <View style={styles.memberNode}>
                  <Text style={styles.avatarEmoji}>👤</Text>
                  <Text style={styles.memberName}>Ivory (You)</Text>
                  <Text style={styles.memberRoleReceiver}>Receiver</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.settleActionBtn}
                onPress={() => Alert.alert('Payment Reminder', 'Copied DuitNow / TNG info for ZhiHeng.')}
              >
                <Ionicons name="paper-plane-outline" size={14} color="#0D9488" />
                <Text style={styles.settleActionText}>Send Payment Ping</Text>
              </TouchableOpacity>
            </View>

            {/* Transfer Card 2 */}
            <View style={styles.transferCard}>
              <View style={styles.transferPathRow}>
                <View style={styles.memberNode}>
                  <Text style={styles.avatarEmoji}>🦊</Text>
                  <Text style={styles.memberName}>Sarah</Text>
                  <Text style={styles.memberRole}>Sender</Text>
                </View>

                <View style={styles.transferArrowBox}>
                  <Text style={styles.transferAmountTag}>RM 75.30</Text>
                  <Ionicons name="arrow-forward" size={18} color="#0D9488" />
                  <Text style={styles.transferMethodText}>Direct Transfer</Text>
                </View>

                <View style={styles.memberNode}>
                  <Text style={styles.avatarEmoji}>🦁</Text>
                  <Text style={styles.memberName}>Chin Jie</Text>
                  <Text style={styles.memberRoleReceiver}>Receiver</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.settleActionBtn}
                onPress={() => Alert.alert('Payment Reminder', 'Copied DuitNow / TNG info for Sarah.')}
              >
                <Ionicons name="paper-plane-outline" size={14} color="#0D9488" />
                <Text style={styles.settleActionText}>Send Payment Ping</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoNotice}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#6B7280" />
              <Text style={styles.infoNoticeText}>
                No in-app banking required. Members settle directly through e-wallets (TNG, GrabPay, or Apple Pay).
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* "ADD EXPENSE" MODAL */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalHeading}>Add New Expense</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)} style={styles.closeCircle}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
              <TouchableOpacity
                style={[styles.receiptTrigger, receiptScanned && styles.receiptTriggerActive]}
                onPress={handleSimulateReceiptScan}
                activeOpacity={0.85}
              >
                <Ionicons
                  name={receiptScanned ? 'checkmark-circle' : 'camera-outline'}
                  size={22}
                  color={receiptScanned ? '#0D9488' : '#4B5563'}
                />
                <View style={styles.flexOne}>
                  <Text style={styles.receiptTriggerTitle}>
                    {receiptScanned ? 'Receipt Photo Processed' : 'Scan Paper Receipt (OCR)'}
                  </Text>
                  <Text style={styles.receiptTriggerSub}>
                    {receiptScanned ? 'Extracted merchant & currency totals' : 'Auto-detect foreign text, amounts & taxes'}
                  </Text>
                </View>
              </TouchableOpacity>

              <Text style={styles.formLabel}>EXPENSE DESCRIPTION</Text>
              <TextInput
                value={expenseTitle}
                onChangeText={setExpenseTitle}
                placeholder="e.g., Gion Ramen Dinner, Taxi Ride"
                style={styles.textInput}
              />

              <Text style={styles.formLabel}>AMOUNT & CURRENCY CONVERTER</Text>
              <View style={styles.amountInputRow}>
                <View style={styles.currencyToggleBox}>
                  <TouchableOpacity
                    onPress={() => setCurrency('JPY')}
                    style={[styles.currencyBtn, currency === 'JPY' && styles.currencyBtnActive]}
                  >
                    <Text style={[styles.currencyBtnText, currency === 'JPY' && styles.currencyBtnTextActive]}>
                      JPY (¥)
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setCurrency('MYR')}
                    style={[styles.currencyBtn, currency === 'MYR' && styles.currencyBtnActive]}
                  >
                    <Text style={[styles.currencyBtnText, currency === 'MYR' && styles.currencyBtnTextActive]}>
                      MYR (RM)
                    </Text>
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={inputAmount}
                  onChangeText={setInputAmount}
                  keyboardType="numeric"
                  style={styles.numericAmountInput}
                  placeholder="0"
                />
              </View>

              <View style={styles.conversionBanner}>
                <Ionicons name="swap-horizontal" size={14} color="#0D9488" />
                <Text style={styles.conversionText}>
                  {currency === 'JPY'
                    ? `¥${numericAmount.toLocaleString()} converts to approx. RM ${convertedAmount}`
                    : `RM ${numericAmount.toLocaleString()} converts to approx. ¥${convertedAmount}`}
                </Text>
              </View>

              <Text style={styles.formLabel}>HOW TO SPLIT?</Text>
              <View style={styles.splitToggleRow}>
                <TouchableOpacity
                  onPress={() => {
                    setSplitMode('equal');
                    setSelectedMemberIds(['1', '2', '3', '4']);
                  }}
                  style={[styles.splitModeBtn, splitMode === 'equal' && styles.splitModeBtnActive]}
                >
                  <Ionicons
                    name="people-outline"
                    size={14}
                    color={splitMode === 'equal' ? '#0D9488' : '#6B7280'}
                  />
                  <Text style={[styles.splitModeText, splitMode === 'equal' && styles.splitModeTextActive]}>
                    Split Equally ({MEMBERS.length} pax)
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setSplitMode('custom')}
                  style={[styles.splitModeBtn, splitMode === 'custom' && styles.splitModeBtnActive]}
                >
                  <Ionicons
                    name="checkbox-outline"
                    size={14}
                    color={splitMode === 'custom' ? '#0D9488' : '#6B7280'}
                  />
                  <Text style={[styles.splitModeText, splitMode === 'custom' && styles.splitModeTextActive]}>
                    Custom Select ({selectedMemberIds.length} pax)
                  </Text>
                </TouchableOpacity>
              </View>

              {splitMode === 'custom' && (
                <View style={styles.memberCheckboxContainer}>
                  {MEMBERS.map((member) => {
                    const isChecked = selectedMemberIds.includes(member.id);
                    return (
                      <TouchableOpacity
                        key={member.id}
                        onPress={() => toggleMemberSelection(member.id)}
                        style={[styles.memberCheckRow, isChecked && styles.memberCheckRowActive]}
                        activeOpacity={0.8}
                      >
                        <View style={styles.memberCheckLeft}>
                          <Text style={styles.memberCheckAvatar}>{member.avatar}</Text>
                          <Text style={styles.memberCheckName}>{member.name}</Text>
                        </View>
                        <Ionicons
                          name={isChecked ? 'checkbox' : 'square-outline'}
                          size={20}
                          color={isChecked ? '#0D9488' : '#9CA3AF'}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              <View style={styles.perPersonPill}>
                <Text style={styles.perPersonLabel}>Per Person Share:</Text>
                <Text style={styles.perPersonValue}>
                  RM {(parseFloat(convertedAmount) / selectedMemberIds.length).toFixed(2)}
                  <Text style={styles.perPersonSub}> / pax</Text>
                </Text>
              </View>

              <TouchableOpacity
                style={styles.saveExpenseBtn}
                onPress={() => {
                  Alert.alert('Expense Logged', `Logged ${expenseTitle || 'Expense'} successfully!`);
                  setShowAddModal(false);
                }}
              >
                <Text style={styles.saveExpenseText}>Confirm & Log Expense</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  circleBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  addBtnHeader: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  tabButtonActive: {
    backgroundColor: '#111827',
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabButtonTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroBalanceCard: {
    backgroundColor: '#0F172A',
    borderRadius: 22,
    padding: 18,
    marginBottom: 14,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  balanceHeaderTitle: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  currencyPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  currencyPillText: {
    color: '#2DD4BF',
    fontSize: 10,
    fontWeight: '700',
  },
  balanceLarge: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  balanceSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    marginBottom: 16,
  },
  balanceStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  statItem: {
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginHorizontal: 12,
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 1,
  },
  statValueGreen: {
    color: '#34D399',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 1,
  },
  quickAddCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 18,
    gap: 12,
  },
  quickAddIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAddTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  quickAddSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.6,
    marginBottom: 10,
    marginLeft: 2,
  },
  expenseItemCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    gap: 12,
  },
  expenseIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0FDFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  expenseDetails: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 6,
  },
  expenseAmountMYR: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
  },
  expenseMeta: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  boldDark: {
    fontWeight: '700',
    color: '#374151',
  },
  expenseOriginalCurrency: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
    marginTop: 2,
  },
  receiptAttachedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    alignSelf: 'flex-start',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 6,
  },
  receiptAttachedText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D9488',
  },
  smartSettleBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    marginBottom: 16,
  },
  smartSettleIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smartSettleBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4338CA',
  },
  smartSettleBannerSub: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    marginTop: 2,
  },
  transferCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  transferPathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  memberNode: {
    alignItems: 'center',
    width: 80,
  },
  avatarEmoji: {
    fontSize: 26,
    marginBottom: 2,
  },
  memberName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  memberRole: {
    fontSize: 10,
    color: '#DC2626',
    fontWeight: '700',
    marginTop: 1,
  },
  memberRoleReceiver: {
    fontSize: 10,
    color: '#0D9488',
    fontWeight: '700',
    marginTop: 1,
  },
  transferArrowBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  transferAmountTag: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0D9488',
    marginBottom: 2,
  },
  transferMethodText: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 2,
  },
  settleActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingVertical: 10,
    borderRadius: 12,
  },
  settleActionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  infoNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  infoNoticeText: {
    fontSize: 11,
    color: '#6B7280',
    flex: 1,
    lineHeight: 16,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 20,
    maxHeight: '90%',
    paddingBottom: 34,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D1D5DB',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalHeading: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  closeCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  receiptTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    marginBottom: 14,
  },
  receiptTriggerActive: {
    borderColor: '#0D9488',
    backgroundColor: '#F0FDFA',
    borderStyle: 'solid',
  },
  receiptTriggerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  receiptTriggerSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#6B7280',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amountInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  currencyToggleBox: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 3,
  },
  currencyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 9,
    justifyContent: 'center',
  },
  currencyBtnActive: {
    backgroundColor: '#0D9488',
  },
  currencyBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
  },
  currencyBtnTextActive: {
    color: '#FFFFFF',
  },
  numericAmountInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  conversionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginTop: 8,
  },
  conversionText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  splitToggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
    marginBottom: 8,
  },
  splitModeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  splitModeBtnActive: {
    backgroundColor: '#CCFBF1',
    borderColor: '#0D9488',
  },
  splitModeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
  splitModeTextActive: {
    color: '#0D9488',
    fontWeight: '700',
  },
  memberCheckboxContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  memberCheckRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  memberCheckRowActive: {
    backgroundColor: '#FFFFFF',
  },
  memberCheckLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  memberCheckAvatar: {
    fontSize: 16,
  },
  memberCheckName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#111827',
  },
  perPersonPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
  },
  perPersonLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  perPersonValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  perPersonSub: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  saveExpenseBtn: {
    backgroundColor: '#111827',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  saveExpenseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});