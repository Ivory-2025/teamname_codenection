import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 44) / 3;

interface JournalPhoto {
  id: string;
  uri: string;
  caption: string;
  location: string;
  date: string;
  uploadedBy: string;
  taggedMemberIds: string[]; // Member IDs recognized by face detection
}

interface PersonAlbum {
  id: string;
  name: string;
  avatar: string;
  faceCount: number;
}

const PEOPLE_ALBUMS: PersonAlbum[] = [
  {
    id: 'm1',
    name: 'Ivory (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    faceCount: 14,
  },
  {
    id: 'm2',
    name: 'Chin Jie',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    faceCount: 9,
  },
  {
    id: 'm3',
    name: 'ZhiHeng',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    faceCount: 11,
  },
  {
    id: 'm4',
    name: 'Sarah',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
    faceCount: 8,
  },
];

const INITIAL_PHOTOS: JournalPhoto[] = [
  {
    id: 'p1',
    uri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
    caption: 'Morning stroll through the towering bamboo grove',
    location: 'Arashiyama, Kyoto',
    date: 'Oct 14, 09:30 AM',
    uploadedBy: 'Ivory (You)',
    taggedMemberIds: ['m1', 'm2'],
  },
  {
    id: 'p2',
    uri: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80',
    caption: 'Tried the giant grilled squid skewers! 🦑',
    location: 'Nishiki Market',
    date: 'Oct 14, 01:15 PM',
    uploadedBy: 'Chin Jie',
    taggedMemberIds: ['m2', 'm3'],
  },
  {
    id: 'p3',
    uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    caption: 'Golden Pavilion gleaming under the autumn sun',
    location: 'Kinkaku-ji',
    date: 'Oct 14, 04:45 PM',
    uploadedBy: 'ZhiHeng',
    taggedMemberIds: ['m1', 'm3', 'm4'],
  },
  {
    id: 'p4',
    uri: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=600&auto=format&fit=crop&q=80',
    caption: 'Matcha ice cream break near the station',
    location: 'Kyoto Central',
    date: 'Oct 15, 11:20 AM',
    uploadedBy: 'Sarah',
    taggedMemberIds: ['m4', 'm1'],
  },
  {
    id: 'p5',
    uri: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=600&auto=format&fit=crop&q=80',
    caption: 'Traditional Gion alleyway at dusk',
    location: 'Gion District',
    date: 'Oct 15, 06:10 PM',
    uploadedBy: 'Ivory (You)',
    taggedMemberIds: ['m1', 'm2', 'm3', 'm4'],
  },
  {
    id: 'p6',
    uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
    caption: 'Late night ramen stop in Osaka Dotonbori',
    location: 'Dotonbori, Osaka',
    date: 'Oct 15, 10:45 PM',
    uploadedBy: 'Chin Jie',
    taggedMemberIds: ['m2', 'm3'],
  },
];

export default function DigitalJournalScreen() {
  const router = useRouter();

  const [photos, setPhotos] = useState<JournalPhoto[]>(INITIAL_PHOTOS);
  const [selectedAlbum, setSelectedAlbum] = useState<PersonAlbum | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<JournalPhoto | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Simulated AI Face Recognition photo upload
  const handleUploadPhoto = () => {
    setIsScanning(true);
    setTimeout(() => {
      const newPhoto: JournalPhoto = {
        id: Date.now().toString(),
        uri: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
        caption: 'Group selfie in front of the shrine torii gate! ⛩️',
        location: 'Fushimi Inari',
        date: 'Just now',
        uploadedBy: 'Ivory (You)',
        taggedMemberIds: ['m1', 'm3'], // Simulated detected faces
      };

      setPhotos([newPhoto, ...photos]);
      setIsScanning(false);
      Alert.alert(
        'AI Face Recognition Complete ✨',
        '2 faces recognized (Ivory & ZhiHeng). Auto-indexed into their personal albums!'
      );
    }, 1400);
  };

  const filteredPhotos = selectedAlbum
    ? photos.filter((p) => p.taggedMemberIds.includes(selectedAlbum.id))
    : photos;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.circleBtn}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={20} color="#111827" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.topBarTitle}>Trip Memories & Journal</Text>
          <Text style={styles.topBarSub}>Autumn in Kansai • {photos.length} Photos</Text>
        </View>
        <TouchableOpacity
          onPress={handleUploadPhoto}
          style={styles.uploadHeaderBtn}
          activeOpacity={0.85}
        >
          <Ionicons name="camera" size={16} color="#FFFFFF" />
          <Text style={styles.uploadHeaderBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* iOS-Style "People & Faces" Horizontal Carousel */}
        <View style={styles.peopleSection}>
          <View style={styles.peopleSectionHeader}>
            <View>
              <Text style={styles.sectionSubtitle}>SMART FACE DETECTION</Text>
              <Text style={styles.sectionTitle}>People Albums</Text>
            </View>
            {selectedAlbum && (
              <TouchableOpacity
                onPress={() => setSelectedAlbum(null)}
                style={styles.clearFilterPill}
              >
                <Text style={styles.clearFilterText}>Show All</Text>
                <Ionicons name="close-circle" size={14} color="#0D9488" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.peopleScroll}>
            {PEOPLE_ALBUMS.map((album) => {
              const isSelected = selectedAlbum?.id === album.id;
              const photoCount = photos.filter((p) => p.taggedMemberIds.includes(album.id)).length;

              return (
                <TouchableOpacity
                  key={album.id}
                  style={[styles.albumBubbleCard, isSelected && styles.albumBubbleCardActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedAlbum(isSelected ? null : album)}
                >
                  <View style={[styles.avatarRing, isSelected && styles.avatarRingActive]}>
                    <Image source={{ uri: album.avatar }} style={styles.avatarFace} />
                    <View style={styles.aiBadge}>
                      <Ionicons name="sparkles" size={10} color="#FFFFFF" />
                    </View>
                  </View>
                  <Text style={[styles.albumName, isSelected && styles.albumNameActive]} numberOfLines={1}>
                    {album.name}
                  </Text>
                  <Text style={styles.albumCount}>{photoCount} photos</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* AI Scanning Status Banner */}
        {isScanning && (
          <View style={styles.scanningBanner}>
            <Ionicons name="scan-outline" size={18} color="#0D9488" />
            <Text style={styles.scanningText}>Analyzing faces & sorting into member albums...</Text>
          </View>
        )}

        {/* Active Filter Indicator */}
        {selectedAlbum && (
          <View style={styles.activeFilterBanner}>
            <Ionicons name="person" size={14} color="#0D9488" />
            <Text style={styles.activeFilterTitle}>
              Showing photos containing <Text style={styles.boldText}>{selectedAlbum.name}</Text>
            </Text>
          </View>
        )}

        {/* 3-Column Photo Grid (iOS Photos Style) */}
        <View style={styles.gridSection}>
          <Text style={styles.gridSectionTitle}>
            {selectedAlbum ? `${selectedAlbum.name}'s Tagged Moments` : 'All Group Uploads'}
          </Text>

          <View style={styles.photoGrid}>
            {filteredPhotos.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.photoGridItem}
                activeOpacity={0.88}
                onPress={() => setSelectedPhoto(item)}
              >
                <Image source={{ uri: item.uri }} style={styles.gridImage} />
                <View style={styles.faceCountTag}>
                  <Ionicons name="people" size={10} color="#FFFFFF" />
                  <Text style={styles.faceCountTagText}>{item.taggedMemberIds.length}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Photo Inspector Modal (With Recognized Faces Tag Pills) */}
      <Modal
        visible={!!selectedPhoto}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPhoto(null)}
      >
        <View style={styles.inspectorBackdrop}>
          <View style={styles.inspectorCard}>
            {selectedPhoto && (
              <>
                <View style={styles.inspectorTopBar}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inspectorLocation}>📍 {selectedPhoto.location}</Text>
                    <Text style={styles.inspectorDate}>{selectedPhoto.date}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedPhoto(null)}
                    style={styles.inspectorCloseBtn}
                  >
                    <Ionicons name="close" size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <Image source={{ uri: selectedPhoto.uri }} style={styles.inspectorHeroImage} />

                <View style={styles.inspectorBody}>
                  <Text style={styles.inspectorCaption}>"{selectedPhoto.caption}"</Text>
                  <Text style={styles.inspectorUploadedBy}>Shared by {selectedPhoto.uploadedBy}</Text>

                  {/* AI Recognized Members in this photo */}
                  <Text style={styles.recognizedFacesLabel}>IDENTIFIED IN THIS PHOTO</Text>
                  <View style={styles.tagWrap}>
                    {selectedPhoto.taggedMemberIds.map((mId) => {
                      const person = PEOPLE_ALBUMS.find((p) => p.id === mId);
                      if (!person) return null;
                      return (
                        <View key={person.id} style={styles.recognizedPersonChip}>
                          <Image source={{ uri: person.avatar }} style={styles.recognizedAvatar} />
                          <Text style={styles.recognizedName}>{person.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </>
            )}
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
  titleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  topBarTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  topBarSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 1,
  },
  uploadHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0D9488',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 14,
  },
  uploadHeaderBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  peopleSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#E5E7EB',
  },
  peopleSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0D9488',
    letterSpacing: 0.6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  clearFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#CCFBF1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clearFilterText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0D9488',
  },
  peopleScroll: {
    paddingHorizontal: 16,
    gap: 14,
  },
  albumBubbleCard: {
    alignItems: 'center',
    width: 80,
  },
  albumBubbleCardActive: {
    transform: [{ scale: 1.05 }],
  },
  avatarRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  avatarRingActive: {
    borderColor: '#0D9488',
    borderWidth: 2.5,
  },
  avatarFace: {
    width: '100%',
    height: '100%',
    borderRadius: 30,
  },
  aiBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  albumName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginTop: 6,
    textAlign: 'center',
  },
  albumNameActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  albumCount: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 1,
  },
  scanningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0FDFA',
    marginHorizontal: 16,
    marginTop: 14,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  scanningText: {
    fontSize: 12,
    color: '#0D9488',
    fontWeight: '600',
  },
  activeFilterBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTitle: {
    fontSize: 12,
    color: '#4B5563',
  },
  boldText: {
    fontWeight: '700',
    color: '#111827',
  },
  gridSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  gridSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  photoGridItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#E5E7EB',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  faceCountTag: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  faceCountTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },

  /* Inspector Modal */
  inspectorBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 16,
  },
  inspectorCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    overflow: 'hidden',
    maxHeight: '90%',
  },
  inspectorTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  inspectorLocation: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  inspectorDate: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  inspectorCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inspectorHeroImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#0F172A',
  },
  inspectorBody: {
    padding: 18,
  },
  inspectorCaption: {
    color: '#F8FAFC',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  inspectorUploadedBy: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
  },
  recognizedFacesLabel: {
    color: '#2DD4BF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 16,
    marginBottom: 8,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recognizedPersonChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  recognizedAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  recognizedName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
});