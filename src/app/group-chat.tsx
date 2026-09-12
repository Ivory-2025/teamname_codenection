import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface BeaconData {
  location: string;
  meetupTime: string;
  countdownMinutes: number;
  active: boolean;
}

interface ChatMessage {
  id: string;
  sender: string;
  isMe: boolean;
  time: string;
  text?: string;
  type: 'text' | 'beacon';
  beacon?: BeaconData;
}

export default function GroupChatScreen() {
  const router = useRouter();

  // Preloaded messages matching your exact chat screenshot
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'Kenji',
      isMe: false,
      time: '1:18 PM',
      type: 'text',
      text: 'Hey guys, Nishiki Market is getting packed! Meet near the matcha soft serve stall?',
    },
    {
      id: 'm2',
      sender: 'Chloe',
      isMe: false,
      time: '1:21 PM',
      type: 'text',
      text: 'On my way! Grabbing iced tea first 🍵',
    },
    {
      id: 'm3',
      sender: 'You',
      isMe: true,
      time: '1:24 PM',
      type: 'text',
      text: 'Just walking past the main gate, see you in 3 mins!',
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');

  // WhatsApp Attachment Sheet State
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  // Beacon Setup Modal States
  const [showBeaconModal, setShowBeaconModal] = useState(false);
  const [beaconLocation, setBeaconLocation] = useState('Nishiki Market Entrance');
  const [beaconMinutes, setBeaconDuration] = useState(15);
  const [beaconTargetTime, setBeaconTargetTime] = useState('01:45 PM');

  const handleSendText = () => {
    if (!inputMessage.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'You',
      isMe: true,
      time: 'Just now',
      type: 'text',
      text: inputMessage.trim(),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
  };

  // Drop Beacon into this chat
  const handleBroadcastBeacon = () => {
    if (!beaconLocation.trim()) {
      Alert.alert('Location Required', 'Please enter a designated meetup point.');
      return;
    }

    const beaconMessage: ChatMessage = {
      id: `beacon-${Date.now()}`,
      sender: 'You',
      isMe: true,
      time: 'Just now',
      type: 'beacon',
      beacon: {
        location: beaconLocation.trim(),
        meetupTime: beaconTargetTime.trim(),
        countdownMinutes: beaconMinutes,
        active: true,
      },
    };

    setMessages((prev) => [...prev, beaconMessage]);
    setShowBeaconModal(false);
    setShowAttachmentMenu(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header matching screenshot */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backArrowBtn}>
          <Ionicons name="chevron-back" size={26} color="#0284C7" />
        </TouchableOpacity>

        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120' }}
          style={styles.headerAvatar}
        />

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTripName}>Autumn in Kansai 🍁</Text>
          <Text style={styles.headerMembersSubtitle}>Kenji, Chloe, Marcus, You</Text>
        </View>

        <TouchableOpacity style={styles.headerRightAction}>
          <Ionicons name="navigate" size={20} color="#0284C7" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.todayPill}>
          <Text style={styles.todayText}>TODAY</Text>
        </View>

        {messages.map((item) => (
          <View
            key={item.id}
            style={[styles.messageWrapper, item.isMe ? styles.messageWrapperMe : styles.messageWrapperThem]}
          >
            {item.type === 'text' ? (
              <View style={[styles.chatBubble, item.isMe ? styles.chatBubbleMe : styles.chatBubbleThem]}>
                {!item.isMe && <Text style={styles.senderHeaderName}>{item.sender}</Text>}
                <Text style={styles.bubbleMessageText}>{item.text}</Text>
                <View style={styles.timeRow}>
                  <Text style={styles.timestampText}>{item.time}</Text>
                  {item.isMe && <Ionicons name="checkmark-done" size={14} color="#38BDF8" style={{ marginLeft: 3 }} />}
                </View>
              </View>
            ) : (
              /* LIVE IN-CHAT BEACON MEETUP CARD */
              <View style={styles.chatBeaconCard}>
                <View style={styles.beaconHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="radio" size={16} color="#B45309" />
                    <Text style={styles.beaconHeaderTag}>MEETUP BEACON</Text>
                  </View>
                  <View style={styles.activePill}>
                    <Text style={styles.activePillText}>ACTIVE</Text>
                  </View>
                </View>

                <View style={styles.beaconLocationBox}>
                  <Text style={styles.beaconLocationLabel}>MEETUP POINT</Text>
                  <Text style={styles.beaconLocationTitle}>⛩️ {item.beacon?.location}</Text>
                  <Text style={styles.beaconLocationSub}>Target Time: {item.beacon?.meetupTime}</Text>
                </View>

                <View style={styles.countdownPillBox}>
                  <Text style={styles.countdownTitle}>REGROUP TIME</Text>
                  <Text style={styles.countdownDigits}>{item.beacon?.countdownMinutes}:00</Text>
                </View>

                <TouchableOpacity
                  style={styles.radarActionBtn}
                  onPress={() => Alert.alert('Radar Proximity 📍', `Navigating to ${item.beacon?.location}`)}
                >
                  <Ionicons name="navigate" size={14} color="#FFFFFF" />
                  <Text style={styles.radarActionBtnText}>Open Proximity Radar</Text>
                </TouchableOpacity>

                <View style={[styles.timeRow, { marginTop: 6 }]}>
                  <Text style={styles.timestampText}>{item.time}</Text>
                  <Ionicons name="checkmark-done" size={14} color="#38BDF8" style={{ marginLeft: 3 }} />
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* WhatsApp-Style '+' Attachment Tray */}
      {showAttachmentMenu && (
        <View style={styles.attachmentSheet}>
          <TouchableOpacity
            style={styles.trayButton}
            onPress={() => {
              setShowAttachmentMenu(false);
              setShowBeaconModal(true);
            }}
          >
            <View style={[styles.trayIconBg, { backgroundColor: '#FEF3C7' }]}>
              <Ionicons name="radio" size={22} color="#D97706" />
            </View>
            <Text style={styles.trayLabel}>Beacon</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.trayButton}
            onPress={() => {
              setShowAttachmentMenu(false);
              Alert.alert('Camera', 'Photo picker ready.');
            }}
          >
            <View style={[styles.trayIconBg, { backgroundColor: '#E0F2FE' }]}>
              <Ionicons name="camera" size={22} color="#0284C7" />
            </View>
            <Text style={styles.trayLabel}>Photo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Bottom Input Bar matching screenshot */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() => setShowAttachmentMenu((prev) => !prev)}
          >
            <Ionicons name={showAttachmentMenu ? 'close' : 'add'} size={24} color="#0284C7" />
          </TouchableOpacity>

          <View style={styles.inputPillContainer}>
            <TextInput
              value={inputMessage}
              onChangeText={setInputMessage}
              placeholder="Message..."
              placeholderTextColor="#9CA3AF"
              style={styles.textInput}
            />
          </View>

          <TouchableOpacity style={styles.sendCircle} onPress={handleSendText}>
            <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* BEACON CREATION MODAL */}
      <Modal visible={showBeaconModal} transparent animationType="slide" onRequestClose={() => setShowBeaconModal(false)}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.modalHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="radio" size={18} color="#D97706" />
                <Text style={styles.modalTitle}>Set Group Meetup Beacon</Text>
              </View>
              <TouchableOpacity onPress={() => setShowBeaconModal(false)} style={styles.circleCloseBtn}>
                <Ionicons name="close" size={18} color="#4B5563" />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabel}>MEETUP POINT / DESTINATION</Text>
            <TextInput
              value={beaconLocation}
              onChangeText={setBeaconLocation}
              placeholder="e.g. Nishiki Market Main Entrance, Exit 4..."
              style={styles.modalInput}
            />

            <Text style={styles.fieldLabel}>MEET IN (MINUTES)</Text>
            <View style={styles.presetMinutesRow}>
              {[10, 15, 30, 45].map((m) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setBeaconDuration(m)}
                  style={[styles.minutePill, beaconMinutes === m && styles.minutePillActive]}
                >
                  <Text style={[styles.minuteText, beaconMinutes === m && styles.minuteTextActive]}>{m}m</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>TARGET TIME</Text>
            <TextInput
              value={beaconTargetTime}
              onChangeText={setBeaconTargetTime}
              placeholder="e.g. 01:45 PM"
              style={styles.modalInput}
            />

            <TouchableOpacity style={styles.broadcastBeaconBtn} onPress={handleBroadcastBeacon}>
              <Ionicons name="radio" size={16} color="#FFFFFF" />
              <Text style={styles.broadcastBeaconBtnText}>Send Meetup Beacon to Chat 📡</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  backArrowBtn: { padding: 4, marginRight: 4 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#E2E8F0' },
  headerTitleBox: { flex: 1, marginLeft: 10 },
  headerTripName: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  headerMembersSubtitle: { fontSize: 11, color: '#64748B', marginTop: 1 },
  headerRightAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollArea: { padding: 16, paddingBottom: 20 },
  todayPill: {
    alignSelf: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 16,
  },
  todayText: { fontSize: 10, fontWeight: '700', color: '#64748B', letterSpacing: 0.5 },
  messageWrapper: { marginBottom: 12 },
  messageWrapperThem: { alignItems: 'flex-start' },
  messageWrapperMe: { alignItems: 'flex-end' },
  chatBubble: {
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chatBubbleThem: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  chatBubbleMe: {
    backgroundColor: '#DCFCE7', // WhatsApp-style light green bubble
    borderTopRightRadius: 4,
  },
  senderHeaderName: { fontSize: 11, fontWeight: '700', color: '#0284C7', marginBottom: 2 },
  bubbleMessageText: { fontSize: 13.5, color: '#1E293B', lineHeight: 19 },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestampText: { fontSize: 10, color: '#94A3B8' },

  // IN-CHAT BEACON CARD
  chatBeaconCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
    width: 250,
  },
  beaconHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  beaconHeaderTag: { fontSize: 10, fontWeight: '800', color: '#B45309', letterSpacing: 0.5 },
  activePill: { backgroundColor: '#FEF3C7', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  activePillText: { fontSize: 9, fontWeight: '800', color: '#B45309' },
  beaconLocationBox: {
    backgroundColor: '#FFFDF5',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 8,
  },
  beaconLocationLabel: { fontSize: 8.5, fontWeight: '800', color: '#92400E' },
  beaconLocationTitle: { fontSize: 12.5, fontWeight: '800', color: '#1E293B', marginTop: 2 },
  beaconLocationSub: { fontSize: 10.5, color: '#D97706', fontWeight: '600', marginTop: 1 },
  countdownPillBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  countdownTitle: { color: '#94A3B8', fontSize: 8, fontWeight: '800', letterSpacing: 0.8 },
  countdownDigits: { color: '#FFFFFF', fontSize: 20, fontWeight: '900', marginTop: 1 },
  radarActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingVertical: 8,
    borderRadius: 8,
  },
  radarActionBtnText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },

  // WHATSAPP '+' ATTACHMENT TRAY
  attachmentSheet: {
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
  },
  trayButton: { alignItems: 'center', gap: 4 },
  trayIconBg: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  trayLabel: { fontSize: 11, fontWeight: '700', color: '#475569' },

  // BOTTOM BAR
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  plusBtn: { width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },
  inputPillContainer: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  textInput: { fontSize: 14, color: '#0F172A' },
  sendCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // MODAL
  modalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.55)' },
  modalSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 36 },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#CBD5E1', alignSelf: 'center', marginBottom: 14 },
  modalHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: '#0F172A' },
  circleCloseBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center' },
  fieldLabel: { fontSize: 10, fontWeight: '800', color: '#64748B', letterSpacing: 0.5, marginTop: 10, marginBottom: 6 },
  modalInput: { backgroundColor: '#F8FAFC', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: '#0F172A', borderWidth: 1, borderColor: '#E2E8F0' },
  presetMinutesRow: { flexDirection: 'row', gap: 8 },
  minutePill: { flex: 1, paddingVertical: 8, borderRadius: 10, backgroundColor: '#F1F5F9', alignItems: 'center' },
  minutePillActive: { backgroundColor: '#FEF3C7', borderWidth: 1, borderColor: '#F59E0B' },
  minuteText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  minuteTextActive: { color: '#B45309' },
  broadcastBeaconBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
  },
  broadcastBeaconBtnText: { color: '#FFFFFF', fontSize: 13, fontWeight: '800' },
});