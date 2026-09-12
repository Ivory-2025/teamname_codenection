import { Border, Colors, Radius, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Keyboard,
  KeyboardEvent,
  Modal,
  PanResponder,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const BUTTON_SIZE = 54;
const PADDING = 16;

type TabBarProps = {
  state: any;
  navigation: any;
  descriptors?: any;
};

const TAB_SLOTS: Array<{
  name: string;
  activeIcon: keyof typeof Ionicons.glyphMap;
  inactiveIcon: keyof typeof Ionicons.glyphMap;
  size: number;
}> = [
  { name: 'index', activeIcon: 'home', inactiveIcon: 'home-outline', size: 22 },
  { name: 'explore', activeIcon: 'compass', inactiveIcon: 'compass-outline', size: 23 },
  { name: 'plan', activeIcon: 'add', inactiveIcon: 'add', size: 22 },
  { name: 'booking', activeIcon: 'ticket', inactiveIcon: 'ticket-outline', size: 22 },
  { name: 'profile', activeIcon: 'person', inactiveIcon: 'person-outline', size: 21 },
];

const MEMBERS = [
  { id: '1', name: 'You', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', dist: 'Current spot', status: 'Online', battery: '92%' },
  { id: '2', name: 'Kenji', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', dist: '120m away', status: 'At Nishiki Market', battery: '78%' },
  { id: '3', name: 'Chloe', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', dist: '450m away', status: 'Coffee stop', battery: '45%' },
  { id: '4', name: 'Marcus', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', dist: '1.2km away', status: 'On transit', battery: '60%' },
];

interface BeaconData {
  location: string;
  meetupTime: string;
  countdownMinutes: number;
  active: boolean;
  photoUri?: string;
}

interface ChatMessage {
  id: string;
  sender: string;
  text?: string;
  imageUri?: string;
  time: string;
  isMe: boolean;
  type?: 'text' | 'beacon' | 'photo';
  beacon?: BeaconData;
}

function LiveBeaconTimer({ initialMinutes }: { initialMinutes: number }) {
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return (
    <Text style={styles.countdownDigits}>
      {mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}
    </Text>
  );
}

function FloatingAssistiveDock() {
  const [activeModal, setActiveModal] = useState<'menu' | 'chat' | 'radar' | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'Kenji', text: 'Hey guys, Nishiki Market is getting packed! Meet near the matcha soft serve stall?', time: '1:18 PM', isMe: false, type: 'text' },
    { id: '2', sender: 'Chloe', text: 'On my way! Grabbing iced tea first 🍵', time: '1:21 PM', isMe: false, type: 'text' },
    { id: '3', sender: 'You', text: 'Just walking past the main gate, see you in 3 mins!', time: '1:24 PM', isMe: true, type: 'text' },
  ]);

  // WhatsApp '+' Tray & Beacon Drawer States
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showBeaconDrawer, setShowBeaconDrawer] = useState(false);
  const [beaconLocation, setBeaconLocation] = useState('Nishiki Market Entrance');
  const [beaconDuration, setBeaconDuration] = useState(15);
  const [beaconTargetTime, setBeaconTargetTime] = useState('01:45 PM');
  const [beaconPhotoUri, setBeaconPhotoUri] = useState<string | undefined>(undefined);

  const scrollViewRef = useRef<ScrollView>(null);
  const keyboardHeight = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onKeyboardShow = (e: KeyboardEvent) => {
      const offset = Platform.OS === 'ios' ? Math.max(e.endCoordinates.height - 40, 0) : 0;
      Animated.timing(keyboardHeight, {
        toValue: offset,
        duration: e.duration || 250,
        useNativeDriver: false,
      }).start();
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    };

    const onKeyboardHide = (e: KeyboardEvent) => {
      Animated.timing(keyboardHeight, {
        toValue: 0,
        duration: e?.duration || 250,
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onKeyboardShow);
    const hideSub = Keyboard.addListener(hideEvent, onKeyboardHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

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
        id: `txt-${Date.now()}`,
        sender: 'You',
        text: inputText.trim(),
        time: 'Just now',
        isMe: true,
        type: 'text',
      },
    ]);
    setInputText('');
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Broadcast Beacon Card into the chat (with landmark photo if attached)
  const handleSendBeaconToChat = () => {
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
        countdownMinutes: beaconDuration,
        photoUri: beaconPhotoUri,
        active: true,
      },
    };

    setMessages((prev) => [...prev, beaconMessage]);
    setShowBeaconDrawer(false);
    setShowAttachmentMenu(false);
    setBeaconPhotoUri(undefined);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Direct standalone photo sending from tray
  const handleSendPhoto = () => {
    setShowAttachmentMenu(false);
    const photoMsg: ChatMessage = {
      id: `photo-${Date.now()}`,
      sender: 'You',
      isMe: true,
      time: 'Just now',
      type: 'photo',
      imageUri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
    };
    setMessages((prev) => [...prev, photoMsg]);
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Snap or pick photo inside Beacon
  const handleSnapBeaconPhoto = () => {
    setBeaconPhotoUri('https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600');
    Alert.alert('Photo Captured 📸', 'Landmark photo attached to your beacon.');
  };

  return (
    <>
      {/* Draggable Bubble */}
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

      {/* 1. Quick Menu Modal */}
      <Modal
        visible={activeModal === 'menu'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setActiveModal(null)}
          style={styles.modalBackdrop}
        >
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

            <View style={styles.actionPillsContainer}>
              <TouchableOpacity
                style={styles.menuActionPill}
                onPress={() => setActiveModal('chat')}
                activeOpacity={0.8}
              >
                <View style={[styles.pillIconBadge, { backgroundColor: '#25D366' }]}>
                  <Ionicons name="chatbubble-ellipses" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.pillLabel}>Group Chat</Text>
                <Text style={styles.pillSub}>{messages.length} msgs</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuActionPill}
                onPress={() => setActiveModal('radar')}
                activeOpacity={0.8}
              >
                <View style={[styles.pillIconBadge, { backgroundColor: '#007AFF' }]}>
                  <Ionicons name="navigate" size={20} color="#FFFFFF" />
                </View>
                <Text style={styles.pillLabel}>Live Radar</Text>
                <Text style={styles.pillSub}>4 active</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* 2. Group Chat Screen */}
      <Modal
        visible={activeModal === 'chat'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.sheetContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveModal('menu')} style={styles.chatBackBtn}>
              <Ionicons name="chevron-back" size={26} color="#007AFF" />
            </TouchableOpacity>
            <Image source={{ uri: MEMBERS[1].avatar }} style={styles.chatAvatar} />
            <View style={styles.chatHeaderInfo}>
              <Text style={styles.chatHeaderTitle}>Autumn in Kansai 🍁</Text>
              <Text style={styles.chatHeaderSub}>Kenji, Chloe, Marcus, You</Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveModal('radar')}
              style={styles.radarHeaderBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="navigate" size={21} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <Animated.View style={[styles.chatFlexBody, { paddingBottom: keyboardHeight }]}>
            <ScrollView
              ref={scrollViewRef}
              style={styles.chatMessagesArea}
              contentContainerStyle={styles.chatMessagesContent}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: false })}
            >
              <View style={styles.chatDatePill}>
                <Text style={styles.chatDateText}>TODAY</Text>
              </View>

              {messages.map((item) => (
                <View
                  key={item.id}
                  style={[
                    styles.messageWrapper,
                    item.isMe ? styles.messageWrapperMe : styles.messageWrapperThem,
                  ]}
                >
                  {item.type === 'beacon' ? (
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

                      {/* Optional Attached Landmark Photo */}
                      {item.beacon?.photoUri && (
                        <Image source={{ uri: item.beacon.photoUri }} style={styles.beaconCardPhoto} />
                      )}

                      <View style={styles.beaconLocationBox}>
                        <Text style={styles.beaconLocationLabel}>MEETUP POINT</Text>
                        <Text style={styles.beaconLocationTitle}>⛩️ {item.beacon?.location}</Text>
                        <Text style={styles.beaconLocationSub}>Target Time: {item.beacon?.meetupTime}</Text>
                      </View>

                      <View style={styles.countdownPillBox}>
                        <Text style={styles.countdownTitle}>REGROUP TIME</Text>
                        <LiveBeaconTimer initialMinutes={item.beacon?.countdownMinutes || 15} />
                      </View>

                      <TouchableOpacity
                        style={styles.radarActionBtn}
                        onPress={() => setActiveModal('radar')}
                      >
                        <Ionicons name="navigate" size={14} color="#FFFFFF" />
                        <Text style={styles.radarActionBtnText}>Open Live Radar Proximity</Text>
                      </TouchableOpacity>

                      <View style={styles.bubbleFooter}>
                        <Text style={styles.bubbleTime}>{item.time}</Text>
                        <Ionicons name="checkmark-done" size={14} color="#34B7F1" />
                      </View>
                    </View>
                  ) : item.type === 'photo' ? (
                    <View
                      style={[
                        styles.messageBubble,
                        item.isMe ? styles.myBubble : styles.theirBubble,
                        { padding: 4 },
                      ]}
                    >
                      <Image source={{ uri: item.imageUri }} style={styles.chatImageContent} />
                      <View style={[styles.bubbleFooter, { paddingHorizontal: 6, paddingBottom: 4 }]}>
                        <Text style={[styles.bubbleTime, item.isMe && styles.myBubbleTime]}>
                          {item.time}
                        </Text>
                        {item.isMe && <Ionicons name="checkmark-done" size={14} color="#34B7F1" />}
                      </View>
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.messageBubble,
                        item.isMe ? styles.myBubble : styles.theirBubble,
                      ]}
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
                  )}
                </View>
              ))}
            </ScrollView>

            {/* WhatsApp '+' Tray: Beacon & Photos */}
            {showAttachmentMenu && (
              <View style={styles.attachmentSheet}>
                <TouchableOpacity
                  style={styles.trayButton}
                  onPress={() => {
                    setShowAttachmentMenu(false);
                    setShowBeaconDrawer(true);
                  }}
                >
                  <View style={[styles.trayIconBg, { backgroundColor: '#FEF3C7' }]}>
                    <Ionicons name="radio" size={22} color="#D97706" />
                  </View>
                  <Text style={styles.trayLabel}>Beacon</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.trayButton} onPress={handleSendPhoto}>
                  <View style={[styles.trayIconBg, { backgroundColor: '#E0F2FE' }]}>
                    <Ionicons name="image" size={22} color="#0284C7" />
                  </View>
                  <Text style={styles.trayLabel}>Photos</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Bottom Input Bar */}
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.mediaBtn}
                onPress={() => {
                  setShowBeaconDrawer(false);
                  setShowAttachmentMenu((prev) => !prev);
                }}
              >
                <Ionicons name={showAttachmentMenu ? 'close' : 'add'} size={24} color="#007AFF" />
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
          </Animated.View>

          {/* INLINE BEACON SETUP DRAWER (Allows Attaching / Snapping Landmark Photo) */}
          {showBeaconDrawer && (
            <View style={styles.inlineDrawerBackdrop}>
              <View style={styles.beaconDrawerSheet}>
                <View style={styles.sheetHandle} />

                <View style={styles.modalHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="radio" size={18} color="#D97706" />
                    <Text style={styles.modalTitle}>Set Group Meetup Beacon</Text>
                  </View>
                  <TouchableOpacity onPress={() => setShowBeaconDrawer(false)} style={styles.circleCloseBtn}>
                    <Ionicons name="close" size={18} color="#4B5563" />
                  </TouchableOpacity>
                </View>

                {/* SNAP / ATTACH PHOTO TO BEACON */}
                <Text style={styles.fieldLabel}>LANDMARK PHOTO (OPTIONAL)</Text>
                {beaconPhotoUri ? (
                  <View style={styles.attachedPhotoPreviewBox}>
                    <Image source={{ uri: beaconPhotoUri }} style={styles.attachedPhotoImg} />
                    <TouchableOpacity
                      style={styles.removePhotoBadge}
                      onPress={() => setBeaconPhotoUri(undefined)}
                    >
                      <Ionicons name="close" size={14} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.snapPhotoBtn} onPress={handleSnapBeaconPhoto}>
                    <Ionicons name="camera" size={16} color="#0D9488" />
                    <Text style={styles.snapPhotoBtnText}>Snap / Attach Landmark Photo</Text>
                  </TouchableOpacity>
                )}

                <Text style={styles.fieldLabel}>MEETUP POINT / DESTINATION</Text>
                <TextInput
                  value={beaconLocation}
                  onChangeText={setBeaconLocation}
                  placeholder="e.g. Nishiki Market Entrance, Main Gate..."
                  placeholderTextColor="#9CA3AF"
                  style={styles.modalInput}
                />

                <Text style={styles.fieldLabel}>COUNTDOWN TIMER (MINUTES)</Text>
                <View style={styles.presetMinutesRow}>
                  {[10, 15, 30, 45].map((m) => (
                    <TouchableOpacity
                      key={m}
                      onPress={() => setBeaconDuration(m)}
                      style={[styles.minutePill, beaconDuration === m && styles.minutePillActive]}
                    >
                      <Text style={[styles.minuteText, beaconDuration === m && styles.minuteTextActive]}>
                        {m}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.fieldLabel}>TARGET TIME</Text>
                <TextInput
                  value={beaconTargetTime}
                  onChangeText={setBeaconTargetTime}
                  placeholder="e.g. 01:45 PM"
                  placeholderTextColor="#9CA3AF"
                  style={styles.modalInput}
                />

                <TouchableOpacity style={styles.broadcastBeaconBtn} onPress={handleSendBeaconToChat}>
                  <Ionicons name="radio" size={16} color="#FFFFFF" />
                  <Text style={styles.broadcastBeaconBtnText}>Send Meetup Beacon to Chat 📡</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </Modal>

      {/* 3. Live Radar Screen */}
      <Modal
        visible={activeModal === 'radar'}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setActiveModal(null)}
      >
        <SafeAreaView style={styles.sheetContainer}>
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setActiveModal('chat')} style={styles.chatBackBtn}>
              <Ionicons name="chevron-back" size={26} color="#007AFF" />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatHeaderTitle}>Live Radar</Text>
              <Text style={styles.chatHeaderSub}>Sharing live location</Text>
            </View>
            <TouchableOpacity
              onPress={() => setActiveModal('chat')}
              style={styles.radarHeaderBtn}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-ellipses" size={22} color="#007AFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.mapCanvas}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1000',
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
        </SafeAreaView>
      </Modal>
    </>
  );
}

function FixedDock({ state, navigation }: TabBarProps) {
  const currentRouteName = state.routes[state.index]?.name;

  return (
    <>
      <FloatingAssistiveDock />

      <View pointerEvents="box-none" style={styles.tabBarWrapper}>
        <View style={styles.liquidGlassCapsule}>
          <BlurView intensity={95} tint="light" style={StyleSheet.absoluteFill} />
          <View style={styles.liquidGleam} />
          <View style={styles.glassRefractionBorder} />

          <View style={styles.iconsRow}>
            {TAB_SLOTS.map((tab) => {
              const isFocused = currentRouteName === tab.name;

              const onPress = () => {
                const targetRoute = state.routes.find((r: any) => r.name === tab.name);
                const event = navigation.emit({
                  type: 'tabPress',
                  target: targetRoute ? targetRoute.key : tab.name,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(tab.name);
                }
              };

              if (tab.name === 'plan') {
                return (
                  <TouchableOpacity
                    key={tab.name}
                    onPress={onPress}
                    activeOpacity={0.85}
                    style={styles.plusPill}
                  >
                    <Ionicons name="add" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={tab.name}
                  onPress={onPress}
                  activeOpacity={0.65}
                  style={styles.tabItem}
                >
                  <Ionicons
                    name={isFocused ? tab.activeIcon : tab.inactiveIcon}
                    size={tab.size}
                    color={isFocused ? '#000000' : 'rgba(0, 0, 0, 0.35)'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FixedDock {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="explore" />
      <Tabs.Screen name="plan" />
      <Tabs.Screen name="booking" />
      <Tabs.Screen name="profile" />
    </Tabs>
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
    gap: 12,
  },
  menuActionPill: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: Radius.card,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.two,
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
  chatFlexBody: {
    flex: 1,
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
    paddingRight: 6,
    paddingVertical: 2,
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
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
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
  messageWrapper: {
    marginBottom: 2,
  },
  messageWrapperThem: {
    alignItems: 'flex-start',
  },
  messageWrapperMe: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  theirBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  myBubble: {
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
  chatImageContent: {
    width: 220,
    height: 150,
    borderRadius: 12,
    marginBottom: 4,
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

  /* In-Chat Beacon Card */
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
  beaconCardPhoto: {
    width: '100%',
    height: 120,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#E2E8F0',
  },
  beaconHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  beaconHeaderTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#B45309',
    letterSpacing: 0.5,
  },
  activePill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#B45309',
  },
  beaconLocationBox: {
    backgroundColor: '#FFFDF5',
    padding: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    marginBottom: 8,
  },
  beaconLocationLabel: {
    fontSize: 8.5,
    fontWeight: '800',
    color: '#92400E',
  },
  beaconLocationTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 2,
  },
  beaconLocationSub: {
    fontSize: 10.5,
    color: '#D97706',
    fontWeight: '600',
    marginTop: 1,
  },
  countdownPillBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  countdownTitle: {
    color: '#94A3B8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  countdownDigits: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 1,
  },
  radarActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingVertical: 8,
    borderRadius: 8,
  },
  radarActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },

  /* WhatsApp '+' Attachment Tray */
  attachmentSheet: {
    flexDirection: 'row',
    gap: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: Border.hairline,
    borderColor: Colors.light.border,
  },
  trayButton: {
    alignItems: 'center',
    gap: 4,
  },
  trayIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trayLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
    paddingVertical: 10,
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

  /* Inline Drawer Backdrop & Sheet */
  inlineDrawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
    zIndex: 9999,
  },
  beaconDrawerSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  circleCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
    marginTop: 8,
    marginBottom: 6,
  },
  snapPhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 4,
  },
  snapPhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D9488',
  },
  attachedPhotoPreviewBox: {
    position: 'relative',
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  },
  attachedPhotoImg: {
    width: '100%',
    height: '100%',
  },
  removePhotoBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  presetMinutesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  minutePill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  minutePillActive: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  minuteText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  minuteTextActive: {
    color: '#B45309',
  },
  broadcastBeaconBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 14,
  },
  broadcastBeaconBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
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
  tabBarWrapper: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 32 : 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liquidGlassCapsule: {
    width: 320,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 28,
    elevation: 0,
    justifyContent: 'center',
  },
  liquidGleam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  glassRefractionBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    borderWidth: 0.75,
    borderColor: 'rgba(255, 255, 255, 0.75)',
  },
  iconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 8,
  },
  tabItem: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusPill: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.light.backgroundSelected,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
});