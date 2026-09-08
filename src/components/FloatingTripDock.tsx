import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 54;
const PADDING = 16;

const MEMBERS = [
  { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', dist: 'Current spot', status: 'Online', battery: '92%' },
  { id: '2', name: 'Kenji', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', dist: '120m away', status: 'At Nishiki Market', battery: '78%' },
  { id: '3', name: 'Chloe', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', dist: '450m away', status: 'Coffee stop', battery: '45%' },
  { id: '4', name: 'Marcus', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', dist: '1.2km away', status: 'On transit', battery: '60%' },
];

export default function FloatingTripDock() {
  const [activeModal, setActiveModal] = useState<'menu' | 'chat' | 'radar' | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', sender: 'Kenji', text: 'Hey guys, Nishiki Market is getting packed! Meet near the matcha soft serve stall?', time: '1:18 PM', isMe: false },
    { id: '2', sender: 'Chloe', text: 'On my way! Grabbing iced tea first 🍵', time: '1:21 PM', isMe: false },
    { id: '3', sender: 'You', text: 'Just walking past the main gate, see you in 3 mins!', time: '1:24 PM', isMe: true },
  ]);

  const pan = useRef(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - BUTTON_SIZE - PADDING,
      y: SCREEN_HEIGHT - 220,
    })
  ).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > 3 || Math.abs(gesture.dy) > 3,
      onPanResponderGrant: () => {
        pan.extractOffset();
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();

        if (Math.abs(gesture.dx) < 5 && Math.abs(gesture.dy) < 5) {
          setActiveModal('menu');
          return;
        }

        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;

        const snapX =
          currentX + BUTTON_SIZE / 2 > SCREEN_WIDTH / 2
            ? SCREEN_WIDTH - BUTTON_SIZE - PADDING
            : PADDING;

        const minY = Platform.OS === 'ios' ? 60 : 40;
        const maxY = SCREEN_HEIGHT - 160;
        const snapY = Math.min(Math.max(currentY, minY), maxY);

        Animated.spring(pan, {
          toValue: { x: snapX, y: snapY },
          friction: 6,
          tension: 40,
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'You',
        text: inputText.trim(),
        time: 'Just now',
        isMe: true,
      },
    ]);
    setInputText('');
  };

  return (
    <>
      {/* Draggable Assistive Touch Bubble */}
      <Animated.View
        style={[
          styles.draggableBubble,
          { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.bubbleCore}>
          <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />
          <Ionicons name="chatbubbles" size={22} color="#FFFFFF" />
          <View style={styles.radarDot}>
            <View style={styles.innerLiveDot} />
          </View>
        </View>
      </Animated.View>

      {/* 1. Quick Menu Modal (Chat & Radar Only) */}
      <Modal
        visible={activeModal === 'menu'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableWithoutFeedback onPress={() => setActiveModal(null)}>
          <View style={styles.modalBackdrop}>
            <TouchableWithoutFeedback>
              <View style={styles.liquidCard}>
                <BlurView intensity={85} tint="light" style={StyleSheet.absoluteFill} />
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.badgeCategory}>TRIP LIVE SPACE</Text>
                    <Text style={styles.cardTripTitle}>Autumn in Kansai</Text>
                  </View>
                  <View style={styles.avatarRow}>
                    {MEMBERS.map((m, idx) => (
                      <Image
                        key={m.id}
                        source={{ uri: m.avatar }}
                        style={[styles.memberAvatar, { marginLeft: idx > 0 ? -10 : 0 }]}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.menuDivider} />

                {/* 2 Equal Columns: Group Chat & Live Radar */}
                <View style={styles.actionPillsContainer}>
                  <TouchableOpacity
                    style={styles.menuActionPill}
                    activeOpacity={0.8}
                    onPress={() => setActiveModal('chat')}
                  >
                    <View style={[styles.pillIconBadge, { backgroundColor: '#25D366' }]}>
                      <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.pillLabel}>Group Chat</Text>
                    <Text style={styles.pillSub}>3 unread</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuActionPill}
                    activeOpacity={0.8}
                    onPress={() => setActiveModal('radar')}
                  >
                    <View style={[styles.pillIconBadge, { backgroundColor: '#007AFF' }]}>
                      <Ionicons name="navigate" size={20} color="#FFFFFF" />
                    </View>
                    <Text style={styles.pillLabel}>Live Radar</Text>
                    <Text style={styles.pillSub}>4 active</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* 2. WhatsApp-Style Group Chat */}
      <Modal
        visible={activeModal === 'chat'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <KeyboardAvoidingView
          style={styles.sheetContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveModal('menu')} style={styles.chatBackBtn}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Image source={{ uri: MEMBERS[1].avatar }} style={styles.chatAvatar} />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderTitle}>Autumn in Kansai 🍁</Text>
              <Text style={styles.chatHeaderSub}>Kenji, Chloe, Marcus, You</Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveModal('radar')}
              style={styles.radarHeaderBtn}
            >
              <Ionicons name="compass-outline" size={22} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.chatMessagesArea}
            contentContainerStyle={styles.chatMessagesContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chatDatePill}>
              <Text style={styles.chatDateText}>TODAY</Text>
            </View>

            {messages.map((item) => (
              <View
                key={item.id}
                style={[styles.messageBubble, item.isMe ? styles.myBubble : styles.theirBubble]}
              >
                {!item.isMe && <Text style={styles.senderLabel}>{item.sender}</Text>}
                <Text style={[styles.bubbleText, item.isMe && styles.myBubbleText]}>
                  {item.text}
                </Text>
                <View style={styles.bubbleFooter}>
                  <Text style={[styles.bubbleTime, item.isMe && styles.myBubbleTime]}>
                    {item.time}
                  </Text>
                  {item.isMe && <Ionicons name="checkmark-done" size={14} color="#34B7F1" />}
                </View>
              </View>
            ))}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.mediaBtn}>
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Message..."
              placeholderTextColor="#8E8E93"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 3. Live Radar Screen */}
      <Modal
        visible={activeModal === 'radar'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.sheetContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveModal('menu')} style={styles.chatBackBtn}>
              <Ionicons name="chevron-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatHeaderTitle}>Live Radar</Text>
              <Text style={styles.chatHeaderSub}>Sharing live location</Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveModal('chat')}
              style={styles.radarHeaderBtn}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.mapCanvas}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000&auto=format&fit=crop&q=80',
              }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.mapDarkDim} />

            <View style={styles.radarRingOuter} />
            <View style={styles.radarRingInner} />

            <View style={[styles.mapPinContainer, { top: '35%', left: '46%' }]}>
              <Image source={{ uri: MEMBERS[0].avatar }} style={styles.pinAvatar} />
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText}>You</Text>
              </View>
            </View>

            <View style={[styles.mapPinContainer, { top: '28%', left: '72%' }]}>
              <Image source={{ uri: MEMBERS[1].avatar }} style={styles.pinAvatar} />
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText}>Kenji (120m)</Text>
              </View>
            </View>

            <View style={[styles.mapPinContainer, { top: '65%', left: '30%' }]}>
              <Image source={{ uri: MEMBERS[2].avatar }} style={styles.pinAvatar} />
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText}>Chloe (450m)</Text>
              </View>
            </View>
          </View>

          <View style={styles.membersSheet}>
            <Text style={styles.memberSheetTitle}>Members Nearby</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
              {MEMBERS.map((m) => (
                <View key={m.id} style={styles.memberCard}>
                  <Image source={{ uri: m.avatar }} style={styles.memberCardImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.memberCardName}>{m.name}</Text>
                    <Text style={styles.memberCardSub}>{m.status} • {m.dist}</Text>
                  </View>
                  <View style={styles.batteryBadge}>
                    <Ionicons name="battery-charging" size={14} color="#10B981" />
                    <Text style={styles.batteryText}>{m.battery}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  draggableBubble: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999999,
    elevation: 999999,
  },
  bubbleCore: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  radarDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(16, 185, 129, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerLiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liquidCard: {
    width: 320,
    borderRadius: Radius.card,
    overflow: 'hidden',
    borderWidth: 0.75,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    padding: Spacing.four,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeCategory: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.light.textTertiary,
  },
  cardTripTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: 2,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  menuDivider: {
    height: Border.hairline,
    backgroundColor: Colors.light.border,
    marginVertical: Spacing.three,
  },
  actionPillsContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  menuActionPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: Radius.card,
    padding: Spacing.three,
    alignItems: 'center',
    borderWidth: Border.hairline,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  pillIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pillLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.light.text,
  },
  pillSub: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  sheetContainer: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: Border.hairline,
    borderBottomColor: Colors.light.border,
  },
  chatBackBtn: {
    paddingRight: 8,
  },
  chatAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
  },
  chatHeaderSub: {
    fontSize: 11,
    color: Colors.light.textTertiary,
  },
  radarHeaderBtn: {
    padding: 6,
  },
  chatMessagesArea: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: Spacing.three,
    gap: 12,
  },
  chatDatePill: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.pill,
    marginBottom: 8,
  },
  chatDateText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.light.textSecondary,
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  theirBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  myBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#E7FFDB',
    borderBottomRightRadius: 4,
  },
  senderLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 2,
  },
  bubbleText: {
    fontSize: 14,
    color: Colors.light.text,
    lineHeight: 19,
  },
  myBubbleText: {
    color: '#000000',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  bubbleTime: {
    fontSize: 10,
    color: Colors.light.textTertiary,
  },
  myBubbleTime: {
    color: 'rgba(0, 0, 0, 0.45)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: Border.hairline,
    borderTopColor: Colors.light.border,
    gap: 8,
  },
  mediaBtn: {
    padding: 4,
  },
  chatTextInput: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 90,
  },
  sendButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapCanvas: {
    flex: 1,
    backgroundColor: '#1E293B',
    position: 'relative',
    overflow: 'hidden',
  },
  mapDarkDim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  radarRingOuter: {
    position: 'absolute',
    top: '25%',
    left: '20%',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  radarRingInner: {
    position: 'absolute',
    top: '35%',
    left: '33%',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  mapPinContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  pinAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  pinLabel: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
    marginTop: 4,
  },
  pinLabelText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  membersSheet: {
    height: 250,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    padding: Spacing.four,
  },
  memberSheetTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.two,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: Border.hairline,
    borderBottomColor: Colors.light.border,
    gap: 12,
  },
  memberCardImg: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  memberCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.text,
  },
  memberCardSub: {
    fontSize: 11,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  batteryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  batteryText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.light.textSecondary,
  },
});