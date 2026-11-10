import React, { useState } from 'react';
import { WeddingData, GuestInvitation, SongRequest } from '../types/wedding';
import {
  Users,
  CheckCircle2,
  Clock,
  UserPlus,
  ShieldCheck,
  Search,
  Download,
  Share2,
  ArrowLeft,
  ScanLine,
  Check,
  X,
  AlertCircle,
  Plus,
  UserCheck,
  UserX,
  HelpCircle,
  Music,
  Disc,
  Star,
  Trash2,
  Disc3,
  Printer,
  Sliders,
  Radio
} from 'lucide-react';

interface CoupleDashboardProps {
  wedding: WeddingData;
  guests: GuestInvitation[];
  onUpdateGuests: (guests: GuestInvitation[]) => void;
  onUpdateWedding?: (updated: WeddingData) => void;
  onClose: () => void;
  onOpenStudio: () => void;
  onDeleteMicrosite?: () => void;
}

export const CoupleDashboard: React.FC<CoupleDashboardProps> = ({
  wedding,
  guests,
  onUpdateGuests,
  onUpdateWedding,
  onClose,
  onOpenStudio,
  onDeleteMicrosite
}) => {
  const [dashboardTab, setDashboardTab] = useState<'guests' | 'playlist' | 'scanner' | 'privacy'>('guests');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'attending' | 'pending' | 'declined' | 'plus-one-pending' | 'plus-one-confirmed'
  >('all');
  const [scannerInput, setScannerInput] = useState('');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    guest?: GuestInvitation;
    message: string;
  } | null>(null);
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPlusOne, setNewGuestPlusOne] = useState(true);
  const [newPlusOneName, setNewPlusOneName] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // DJ Celebration Playlist State (Starts completely empty)
  const [songList, setSongList] = useState<SongRequest[]>(
    wedding.songRequests || []
  );
  const [songFilter, setSongFilter] = useState<'all' | 'must-play' | 'approved' | 'pending' | 'declined'>('all');
  const [isAiDjLoading, setIsAiDjLoading] = useState(false);
  const [aiDjCuratorAdvice, setAiDjCuratorAdvice] = useState<string | null>(null);
  const [showAddSongModal, setShowAddSongModal] = useState(false);
  const [manualSongTitle, setManualSongTitle] = useState('');
  const [manualSongArtist, setManualSongArtist] = useState('');
  const [manualSongEnergy, setManualSongEnergy] = useState<'chill' | 'mid-tempo' | 'high-energy' | 'party-anthem'>('high-energy');
  const [manualSongGuest, setManualSongGuest] = useState('Couple Choice');

  // Complete Microsite Deletion State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Compute analytics
  const totalGuests = guests.length;
  const attendingGuests = guests.filter((g) => g.status === 'attending');
  const pendingGuests = guests.filter((g) => g.status === 'pending');
  const declinedGuests = guests.filter((g) => g.status === 'declined');

  // Plus-Ones Breakdown
  const guestsWithPlusOne = guests.filter((g) => g.hasPlusOne);
  const confirmedPlusOnes = guests.filter(
    (g) => g.hasPlusOne && g.plusOneStatus === 'confirmed' && g.status === 'attending'
  );
  const pendingPlusOnes = guests.filter(
    (g) => g.hasPlusOne && (!g.plusOneStatus || g.plusOneStatus === 'pending') && g.status !== 'declined'
  );
  const rejectedPlusOnes = guests.filter(
    (g) => g.hasPlusOne && g.plusOneStatus === 'rejected'
  );

  // Total Confirmed Attendance Headcount: Primary Attending + Confirmed Plus-Ones
  const totalConfirmedAttendees = attendingGuests.length + confirmedPlusOnes.length;
  // Maximum potential headcount if all pending attend and get approved
  const maxPotentialHeadcount =
    attendingGuests.length +
    pendingGuests.length +
    confirmedPlusOnes.length +
    pendingPlusOnes.length;

  const checkedInCount = guests.filter((g) => g.checkedIn).length;

  // Filter guests
  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (g.plusOneName && g.plusOneName.toLowerCase().includes(searchTerm.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterStatus === 'all') return true;
    if (filterStatus === 'attending') return g.status === 'attending';
    if (filterStatus === 'pending') return g.status === 'pending';
    if (filterStatus === 'declined') return g.status === 'declined';
    if (filterStatus === 'plus-one-pending') {
      return g.hasPlusOne && (!g.plusOneStatus || g.plusOneStatus === 'pending');
    }
    if (filterStatus === 'plus-one-confirmed') {
      return g.hasPlusOne && g.plusOneStatus === 'confirmed';
    }
    return true;
  });

  // Handle Plus-One status confirmation or rejection
  const handleUpdatePlusOneStatus = (
    guestId: string,
    newStatus: 'confirmed' | 'rejected' | 'pending'
  ) => {
    const targetGuest = guests.find((g) => g.id === guestId);
    if (!targetGuest) return;

    const updated = guests.map((g) =>
      g.id === guestId ? { ...g, plusOneStatus: newStatus } : g
    );
    onUpdateGuests(updated);

    const actionText =
      newStatus === 'confirmed'
        ? `Confirmed plus-one (${targetGuest.plusOneName || 'Guest'}) for ${targetGuest.fullName}`
        : newStatus === 'rejected'
        ? `Declined plus-one for ${targetGuest.fullName}`
        : `Reset plus-one to pending review for ${targetGuest.fullName}`;

    setToastMessage(actionText);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Door QR Code Validator
  const handleVerifyPass = (code: string) => {
    const clean = code.trim().toUpperCase();
    const guest = guests.find(
      (g) => g.id.toUpperCase() === clean || clean.includes(g.id.toUpperCase())
    );

    if (guest) {
      const updated = guests.map((g) =>
        g.id === guest.id
          ? {
              ...g,
              checkedIn: true,
              checkedInAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          : g
      );
      onUpdateGuests(updated);

      const plusOneText =
        guest.hasPlusOne && guest.plusOneStatus === 'confirmed'
          ? ` (+1 Confirmed: ${guest.plusOneName || 'Guest'})`
          : guest.hasPlusOne && guest.plusOneStatus === 'rejected'
          ? ' (Note: Plus-one was declined, admitted single)'
          : '';

      setScanResult({
        success: true,
        guest,
        message: `Verified: ${guest.fullName}${plusOneText} admitted to venue. Pass ID: ${guest.id}`
      });
    } else {
      setScanResult({
        success: false,
        message: `Invalid Pass ID "${code}". No matching invitation found in registry.`
      });
    }
  };

  const handleStatusChange = (
    id: string,
    newStatus: 'attending' | 'pending' | 'declined'
  ) => {
    const updated = guests.map((g) => (g.id === id ? { ...g, status: newStatus } : g));
    onUpdateGuests(updated);
  };

  const handleToggleCheckIn = (id: string) => {
    const updated = guests.map((g) =>
      g.id === id
        ? {
            ...g,
            checkedIn: !g.checkedIn,
            checkedInAt: !g.checkedIn
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined
          }
        : g
    );
    onUpdateGuests(updated);
  };

  const handleExportCSV = () => {
    const headers = [
      'Pass ID',
      'Primary Guest Name',
      'RSVP Status',
      'Has Plus One',
      'Plus One Name',
      'Plus One Status',
      'Plus One Dietary',
      'Primary Dietary',
      'Checked In',
      'Admission Time'
    ];
    const rows = guests.map((g) => [
      g.id,
      `"${g.fullName}"`,
      g.status,
      g.hasPlusOne ? 'Yes' : 'No',
      `"${g.plusOneName || ''}"`,
      g.plusOneStatus || 'N/A',
      `"${g.plusOneDietary || ''}"`,
      `"${g.dietaryRequirements || ''}"`,
      g.checkedIn ? 'Yes' : 'No',
      g.checkedInAt || ''
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${wedding.slug}_attendees_plus_ones.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // DJ Playlist Management Handlers
  const handleUpdateSongStatus = (
    songId: string,
    status: 'must-play' | 'approved' | 'declined' | 'pending'
  ) => {
    const updated = songList.map((s) => (s.id === songId ? { ...s, status } : s));
    setSongList(updated);
    if (onUpdateWedding) {
      onUpdateWedding({ ...wedding, songRequests: updated });
    }
    setToastMessage(`Updated track status to "${status.toUpperCase()}".`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleDeleteSong = (songId: string) => {
    const updated = songList.filter((s) => s.id !== songId);
    setSongList(updated);
    if (onUpdateWedding) {
      onUpdateWedding({ ...wedding, songRequests: updated });
    }
  };

  const handleUpdateSongNotes = (songId: string, djNotes: string) => {
    const updated = songList.map((s) => (s.id === songId ? { ...s, djNotes } : s));
    setSongList(updated);
    if (onUpdateWedding) {
      onUpdateWedding({ ...wedding, songRequests: updated });
    }
  };

  const handleAddManualSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualSongTitle.trim() || !manualSongArtist.trim()) return;

    const newSong: SongRequest = {
      id: `song-${Date.now()}`,
      songTitle: manualSongTitle.trim(),
      artist: manualSongArtist.trim(),
      guestName: manualSongGuest.trim() || 'Couple Choice',
      danceEnergy: manualSongEnergy,
      status: 'must-play'
    };

    const updated = [newSong, ...songList];
    setSongList(updated);
    if (onUpdateWedding) {
      onUpdateWedding({ ...wedding, songRequests: updated });
    }

    setManualSongTitle('');
    setManualSongArtist('');
    setShowAddSongModal(false);
    setToastMessage(`Added "${newSong.songTitle}" to DJ Must-Play list!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCurateAiDjSetflow = async () => {
    setIsAiDjLoading(true);
    setAiDjCuratorAdvice(null);
    try {
      const res = await fetch('/api/ai/dj-playlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weddingContext: {
            partner1: wedding.partner1,
            partner2: wedding.partner2,
            venue: wedding.venue,
            city: wedding.city
          },
          songRequests: songList
        })
      });
      const data = await res.json();
      if (data.setflow) {
        setAiDjCuratorAdvice(data.setflow);
      } else {
        setAiDjCuratorAdvice(
          `DJ SETFLOW & ENERGY CURVE:\n\n1. Cocktail & Seated Dinner: At Last (Etta James), La Vie En Rose (Édith Piaf)\n2. Cake Cutting & First Dance: Stand by Me (Ben E. King)\n3. Prime Dancefloor Peak: Can’t Take My Eyes Off You (Frankie Valli), September (Earth Wind & Fire)\n4. Golden Midnight Singalong: Don’t Stop Believin’ (Journey)`
        );
      }
    } catch {
      setAiDjCuratorAdvice(
        `DJ SETFLOW RECOMMENDATION:\nBegin with romantic jazz & vintage soul during reception dinner, transition to motown and 80s disco floor-fillers after 21:00, and close with collective singalong anthems.`
      );
    } finally {
      setIsAiDjLoading(false);
    }
  };

  const handleExportDjCSV = () => {
    const headers = ['Track Title', 'Artist', 'Requested By', 'Status for DJ', 'Energy Level', 'DJ Special Cue Notes'];
    const rows = songList.map((s) => [
      `"${s.songTitle}"`,
      `"${s.artist}"`,
      `"${s.guestName}"`,
      s.status || 'approved',
      s.danceEnergy || 'high-energy',
      `"${s.djNotes || ''}"`
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${wedding.slug}_dj_celebration_playlist.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      setDeleteError('Please type DELETE in capital letters to confirm permanent erasure.');
      return;
    }
    setDeleteError(null);
    setShowDeleteModal(false);
    if (onDeleteMicrosite) {
      onDeleteMicrosite();
    }
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const newGuest: GuestInvitation = {
      id: `AUR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newGuestName.trim(),
      email: newGuestEmail.trim(),
      status: 'pending',
      eventsAttending: wedding.events.map((e) => e.id),
      hasPlusOne: newGuestPlusOne,
      plusOneName: newGuestPlusOne ? newPlusOneName.trim() || 'Accompanying Guest' : undefined,
      plusOneStatus: newGuestPlusOne ? 'pending' : undefined,
      plusOneAllowed: newGuestPlusOne,
      dietaryRequirements: '',
      invitationGeneratedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      checkedIn: false
    };
    onUpdateGuests([newGuest, ...guests]);
    setNewGuestName('');
    setNewGuestEmail('');
    setNewGuestPlusOne(true);
    setNewPlusOneName('');
    setShowAddGuestModal(false);

    setToastMessage(`Added ${newGuest.fullName} to guest registry.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F3EDE2] text-[#292722] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#B59A72]/20 mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#FAF7F0] rounded-xs border border-[#B59A72]/30 text-[#292722] transition-colors"
              title="Return to Homepage"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-editorial uppercase tracking-[0.2em] text-[#8C6D45] block">
                Couple Concierge
              </span>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal">
                Guest &amp; Plus-One Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddGuestModal(true)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#292722] hover:bg-[#8C6D45] rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Guest
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#B59A72]/40 rounded-xs hover:bg-[#FAF7F0] transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-[#8C6D45]" />
              Export CSV
            </button>
            <button
              onClick={onOpenStudio}
              className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#B59A72]/40 rounded-xs hover:bg-[#FAF7F0] transition-colors"
            >
              Invitation Designer
            </button>
          </div>
        </div>

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Primary View Switcher Navigation Tabs */}
        <div className="flex items-center gap-3 sm:gap-6 border-b border-[#B59A72]/20 mb-8 overflow-x-auto text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => setDashboardTab('guests')}
            className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'guests'
                ? 'border-[#8C6D45] text-[#8C6D45]'
                : 'border-transparent text-neutral-500 hover:text-[#292722]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Guest RSVPs &amp; Plus-Ones ({totalGuests})</span>
          </button>
          <button
            onClick={() => setDashboardTab('playlist')}
            className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'playlist'
                ? 'border-[#8C6D45] text-[#8C6D45]'
                : 'border-transparent text-neutral-500 hover:text-[#292722]'
            }`}
          >
            <Music className="w-4 h-4 text-[#8C6D45]" />
            <span>DJ Celebration Playlist ({songList.length})</span>
          </button>
          <button
            onClick={() => setDashboardTab('scanner')}
            className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'scanner'
                ? 'border-[#8C6D45] text-[#8C6D45]'
                : 'border-transparent text-neutral-500 hover:text-[#292722]'
            }`}
          >
            <ScanLine className="w-4 h-4" />
            <span>Pass Scanner ({checkedInCount}/{totalConfirmedAttendees})</span>
          </button>
          <button
            onClick={() => setDashboardTab('privacy')}
            className={`pb-3.5 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              dashboardTab === 'privacy'
                ? 'border-rose-700 text-rose-700'
                : 'border-transparent text-neutral-500 hover:text-rose-700'
            }`}
          >
            <Trash2 className="w-4 h-4" />
            <span>Privacy &amp; Deletion</span>
          </button>
        </div>

        {/* 1. GUEST RSVPS & PLUS-ONES TAB */}
        {dashboardTab === 'guests' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {/* Card 1: Total Confirmed Attendees (Headcount) */}
          <div className="bg-[#FAF7F0] p-4 rounded-sm border-2 border-[#8C6D45]/40 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
              <span className="font-semibold text-[#8C6D45] uppercase tracking-wider text-[11px]">
                Total Confirmed Seats
              </span>
              <UserCheck className="w-4 h-4 text-[#8C6D45]" />
            </div>
            <div className="font-editorial text-3xl sm:text-4xl font-normal text-[#292722] tabular-nums">
              {totalConfirmedAttendees}
            </div>
            <p className="text-[11px] text-[#5A554E] mt-1">
              <span className="font-medium text-[#292722]">{attendingGuests.length}</span> primary +{' '}
              <span className="font-medium text-emerald-700">{confirmedPlusOnes.length}</span> confirmed +1s
            </p>
          </div>

          {/* Card 2: Primary Confirmed RSVPs */}
          <div className="bg-[#FAF7F0] p-4 rounded-sm border border-[#B59A72]/30">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Primary Guests RSVP</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-emerald-800 tabular-nums">
              {attendingGuests.length} / {totalGuests}
            </div>
            <span className="text-[10px] text-neutral-500">
              {pendingGuests.length} awaiting response
            </span>
          </div>

          {/* Card 3: Plus-One Review Queue */}
          <div className="bg-[#FAF7F0] p-4 rounded-sm border border-[#B59A72]/30">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Plus-One Requests</span>
              <UserPlus className="w-4 h-4 text-[#8C6D45]" />
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#292722] tabular-nums">
              {guestsWithPlusOne.length}
            </div>
            <p className="text-[10px] text-neutral-600 mt-1">
              <span className="text-emerald-700 font-medium">{confirmedPlusOnes.length} Confirmed</span> ·{' '}
              <span className="text-amber-700 font-medium">{pendingPlusOnes.length} Pending</span> ·{' '}
              <span className="text-rose-700 font-medium">{rejectedPlusOnes.length} Declined</span>
            </p>
          </div>

          {/* Card 4: Potential Headcount Ceiling */}
          <div className="bg-[#FAF7F0] p-4 rounded-sm border border-[#B59A72]/30">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Potential Max Guests</span>
              <Users className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-neutral-700 tabular-nums">
              {maxPotentialHeadcount}
            </div>
            <span className="text-[10px] text-neutral-500">If all pending attend</span>
          </div>

          {/* Card 5: Venue Door Check-In Scanned */}
          <div className="col-span-2 lg:col-span-1 bg-[#FAF7F0] p-4 rounded-sm border border-[#B59A72]/30">
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span>Door Checked-In</span>
              <ShieldCheck className="w-4 h-4 text-[#8C6D45]" />
            </div>
            <div className="font-editorial text-2xl sm:text-3xl font-normal text-[#292722] tabular-nums">
              {checkedInCount} / {totalConfirmedAttendees}
            </div>
            <span className="text-[10px] text-neutral-500">Entrance passes verified</span>
          </div>
        </div>

        {/* 2. QR Code Entrance Pass Scanner */}
        <div className="bg-[#FAF7F0] p-5 sm:p-6 rounded-sm border border-[#B59A72]/40 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#8C6D45]">
                <ScanLine className="w-4 h-4" />
                Venue Door Entrance Pass Verifier
              </div>
              <p className="text-xs text-neutral-600 mt-1">
                Scan physical invitation QR codes or enter Guest Pass IDs to verify access and record door admission.
              </p>
            </div>

            <div className="flex items-center gap-2 max-w-md w-full">
              <input
                type="text"
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerifyPass(scannerInput);
                }}
                placeholder="Enter Pass ID (e.g. AUR-8012)"
                className="flex-1 px-3.5 py-2 text-xs bg-white border border-[#B59A72]/40 rounded-xs uppercase font-mono text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
              />
              <button
                type="button"
                onClick={() => handleVerifyPass(scannerInput)}
                className="px-4 py-2 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap"
              >
                Validate Pass
              </button>
            </div>
          </div>

          {/* Scanner Result Banner */}
          {scanResult && (
            <div
              className={`mt-4 p-3 rounded-xs text-xs flex items-center justify-between gap-2 border ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {scanResult.success ? (
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{scanResult.message}</span>
              </div>
              <button
                onClick={() => setScanResult(null)}
                className="text-neutral-500 hover:text-neutral-900 font-mono text-xs"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* 3. Search & Comprehensive Filter Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-4">
          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guest or plus-one name, pass ID..."
              className="w-full pl-9 pr-3.5 py-2 text-xs bg-white border border-[#B59A72]/30 rounded-xs text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
            />
          </div>

          {/* Filter segment tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#FAF7F0] rounded-xs border border-[#B59A72]/20 text-xs overflow-x-auto">
            {[
              { id: 'all', label: 'All Guests' },
              { id: 'attending', label: 'Attending' },
              { id: 'plus-one-pending', label: `+1 Review (${pendingPlusOnes.length})` },
              { id: 'plus-one-confirmed', label: `+1 Confirmed (${confirmedPlusOnes.length})` },
              { id: 'pending', label: 'RSVP Pending' },
              { id: 'declined', label: 'Declined' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id as typeof filterStatus)}
                className={`px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap ${
                  filterStatus === tab.id
                    ? 'bg-[#292722] text-white font-medium shadow-xs'
                    : 'text-neutral-600 hover:text-[#292722]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Guest Roster Table with Dedicated Plus-One Controls */}
        <div className="bg-[#FAF7F0] rounded-sm border border-[#B59A72]/30 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#EFEAE2] border-b border-[#B59A72]/20 text-[11px] uppercase tracking-wider text-neutral-600">
                <tr>
                  <th className="py-3 px-4 font-semibold">Pass ID</th>
                  <th className="py-3 px-4 font-semibold">Primary Guest</th>
                  <th className="py-3 px-4 font-semibold">RSVP Decision</th>
                  <th className="py-3 px-4 font-semibold">Plus-One Details</th>
                  <th className="py-3 px-4 font-semibold">Plus-One Host Action</th>
                  <th className="py-3 px-4 font-semibold">Check-In</th>
                  <th className="py-3 px-4 font-semibold text-right">Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#B59A72]/15">
                {filteredGuests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-neutral-500">
                      <div className="max-w-md mx-auto space-y-2">
                        <div className="w-12 h-12 rounded-full bg-[#FAF7F0] border border-[#B59A72]/30 flex items-center justify-center mx-auto text-[#8C6D45]">
                          <Users className="w-6 h-6" />
                        </div>
                        <p className="font-editorial text-lg text-[#292722] font-normal">
                          {guests.length === 0 ? 'No Guest Entries Yet' : 'No Guests Match Filters'}
                        </p>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {guests.length === 0
                            ? 'The guest roster and invitation requests are completely empty. When guests RSVP on the microsite or generate an entrance pass, their records and plus-ones will automatically appear here.'
                            : 'Try adjusting or clearing your search term and RSVP status filters above.'}
                        </p>
                        {guests.length === 0 && (
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => setShowAddGuestModal(true)}
                              className="px-4 py-2 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors inline-flex items-center gap-1.5"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add First Guest Manually</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredGuests.map((guest) => {
                    const hasP1 = guest.hasPlusOne;
                    const p1Status = guest.plusOneStatus || (hasP1 ? 'pending' : undefined);

                    return (
                      <tr key={guest.id} className="hover:bg-white/60 transition-colors">
                        {/* Pass ID */}
                        <td className="py-3.5 px-4 font-mono font-semibold text-[#8C6D45]">
                          {guest.id}
                        </td>

                        {/* Primary Guest Info */}
                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-[#292722] block">
                            {guest.fullName}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {guest.email || guest.phone || 'Personalized invite'}
                          </span>
                          {guest.dietaryRequirements && (
                            <span className="text-[10px] text-[#8C6D45] block mt-0.5">
                              Dietary: {guest.dietaryRequirements}
                            </span>
                          )}
                        </td>

                        {/* RSVP Decision */}
                        <td className="py-3.5 px-4">
                          <select
                            value={guest.status}
                            onChange={(e) =>
                              handleStatusChange(
                                guest.id,
                                e.target.value as 'attending' | 'pending' | 'declined'
                              )
                            }
                            className={`text-xs py-1 px-2 rounded-xs border font-medium uppercase tracking-wider ${
                              guest.status === 'attending'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : guest.status === 'pending'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-rose-50 text-rose-800 border-rose-300'
                            }`}
                          >
                            <option value="attending">Attending</option>
                            <option value="pending">Pending</option>
                            <option value="declined">Declined</option>
                          </select>
                        </td>

                        {/* Plus-One Details */}
                        <td className="py-3.5 px-4">
                          {hasP1 ? (
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-medium text-[#292722]">
                                  +1 {guest.plusOneName || 'Guest Requested'}
                                </span>
                              </div>
                              {guest.plusOneDietary && (
                                <span className="text-[10px] text-neutral-500 block mt-0.5">
                                  Dietary: {guest.plusOneDietary}
                                </span>
                              )}
                              {/* Status badge */}
                              <div className="mt-1">
                                {p1Status === 'confirmed' && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-xs border border-emerald-200">
                                    <Check className="w-2.5 h-2.5" />
                                    Confirmed Seat
                                  </span>
                                )}
                                {p1Status === 'rejected' && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-xs border border-rose-200">
                                    <X className="w-2.5 h-2.5" />
                                    Declined / Single Only
                                  </span>
                                )}
                                {p1Status === 'pending' && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-xs border border-amber-200">
                                    <Clock className="w-2.5 h-2.5" />
                                    Awaiting Couple Approval
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-xs">No plus-one</span>
                          )}
                        </td>

                        {/* Plus-One Host Action Controls (Confirm / Reject) */}
                        <td className="py-3.5 px-4">
                          {hasP1 ? (
                            <div className="flex items-center gap-1.5">
                              {p1Status !== 'confirmed' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePlusOneStatus(guest.id, 'confirmed')}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs transition-colors flex items-center gap-1 shadow-xs"
                                  title="Approve / Confirm this plus-one"
                                >
                                  <Check className="w-3 h-3" />
                                  Confirm
                                </button>
                              )}
                              {p1Status !== 'rejected' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePlusOneStatus(guest.id, 'rejected')}
                                  className="px-2.5 py-1 text-[11px] font-semibold bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xs transition-colors flex items-center gap-1"
                                  title="Decline this plus-one"
                                >
                                  <X className="w-3 h-3" />
                                  Decline
                                </button>
                              )}
                              {p1Status !== 'pending' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdatePlusOneStatus(guest.id, 'pending')}
                                  className="p-1 text-neutral-400 hover:text-neutral-700 text-[10px]"
                                  title="Reset to pending review"
                                >
                                  <HelpCircle className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          ) : (
                            <span className="text-neutral-400 text-[11px]">—</span>
                          )}
                        </td>

                        {/* Door Check-In Status */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleCheckIn(guest.id)}
                            className={`px-2.5 py-1 text-[11px] font-medium rounded-xs border transition-colors flex items-center gap-1 ${
                              guest.checkedIn
                                ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                                : 'bg-white border-neutral-300 text-neutral-600 hover:border-[#8C6D45]'
                            }`}
                          >
                            {guest.checkedIn ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-700" />
                                <span>Admitted {guest.checkedInAt || ''}</span>
                              </>
                            ) : (
                              <span>Door Check-in</span>
                            )}
                          </button>
                        </td>

                        {/* WhatsApp / Pass Share */}
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              const url = `https://${wedding.customDomain || 'aurelia.invites'}/pass/${guest.id}`;
                              const p1Note =
                                guest.hasPlusOne && guest.plusOneStatus === 'confirmed'
                                  ? ` (Includes confirmed seat for +1: ${guest.plusOneName || 'Guest'})`
                                  : '';
                              const text = encodeURIComponent(
                                `Dear ${guest.fullName},\nYour wedding invitation pass for Sarah & James is ready${p1Note}:\n${url}`
                              );
                              window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
                            }}
                            className="p-1.5 text-neutral-600 hover:text-emerald-700 hover:bg-white rounded-xs transition-colors"
                            title="Share via WhatsApp"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )}

        {/* 2. DJ CELEBRATION PLAYLIST TAB */}
        {dashboardTab === 'playlist' && (
          <div className="space-y-6">
            {/* Top DJ Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF7F0] p-4 sm:p-6 rounded-sm border border-[#B59A72]/30 shadow-xs">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8C6D45] block font-semibold">
                  Reception DJ Curator
                </span>
                <h2 className="font-editorial text-2xl sm:text-3xl text-[#292722]">
                  Celebration Dancefloor Playlist
                </h2>
                <p className="text-xs text-neutral-600 mt-1">
                  Captured guest song requests from the wedding microsite with approval controls and AI setflow curation.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setShowAddSongModal(true)}
                  className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[#292722] hover:bg-[#8C6D45] rounded-xs transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Track</span>
                </button>

                <button
                  type="button"
                  onClick={handleCurateAiDjSetflow}
                  disabled={isAiDjLoading}
                  className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#8C6D45] bg-white border border-[#B59A72]/40 hover:bg-[#FAF7F0] rounded-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                >
                  <Disc3 className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{isAiDjLoading ? 'Curating Setflow...' : 'Curate Setflow'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportDjCSV}
                  className="px-3.5 py-2 text-xs font-semibold uppercase tracking-wider bg-white border border-[#B59A72]/40 rounded-xs hover:bg-[#FAF7F0] transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5 text-[#8C6D45]" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="p-2 bg-white border border-[#B59A72]/40 rounded-xs hover:bg-[#FAF7F0] text-neutral-700"
                  title="Print DJ Tracklist"
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* AI DJ Recommendations Output Box */}
            {aiDjCuratorAdvice && (
              <div className="p-5 bg-[#1C1B18] text-[#FAF7F0] rounded-sm shadow-xl relative">
                <div className="flex items-center justify-between mb-3 pb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#D4AF37]" />
                    <span className="font-editorial text-lg text-white">
                      Curated DJ Setflow &amp; Transition Strategy
                    </span>
                  </div>
                  <button
                    onClick={() => setAiDjCuratorAdvice(null)}
                    className="text-neutral-400 hover:text-white font-mono text-xs"
                  >
                    ✕
                  </button>
                </div>
                <div className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line font-sans-ui">
                  {aiDjCuratorAdvice}
                </div>
              </div>
            )}

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#FAF7F0] p-4 rounded-sm shadow-sm text-xs">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">Total Requests</span>
                <span className="font-editorial text-2xl text-[#292722]">{songList.length} Tracks</span>
              </div>
              <div className="bg-[#FAF7F0] p-4 rounded-sm shadow-sm text-xs">
                <span className="text-amber-700 font-semibold uppercase tracking-wider text-[10px] block">★ Must-Plays</span>
                <span className="font-editorial text-2xl text-amber-800">
                  {songList.filter((s) => s.status === 'must-play').length} Tracks
                </span>
              </div>
              <div className="bg-[#FAF7F0] p-4 rounded-sm shadow-sm text-xs">
                <span className="text-emerald-700 font-semibold uppercase tracking-wider text-[10px] block">✓ Approved</span>
                <span className="font-editorial text-2xl text-emerald-800">
                  {songList.filter((s) => s.status === 'approved').length} Tracks
                </span>
              </div>
              <div className="bg-[#FAF7F0] p-4 rounded-sm shadow-sm text-xs">
                <span className="text-neutral-500 uppercase tracking-wider text-[10px] block">• Pending Review</span>
                <span className="font-editorial text-2xl text-neutral-700">
                  {songList.filter((s) => !s.status || s.status === 'pending').length} Tracks
                </span>
              </div>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F0] rounded-xs shadow-xs text-xs w-fit">
              {[
                { id: 'all', label: `All (${songList.length})` },
                { id: 'must-play', label: `★ Must-Play (${songList.filter((s) => s.status === 'must-play').length})` },
                { id: 'approved', label: `✓ Approved (${songList.filter((s) => s.status === 'approved').length})` },
                { id: 'pending', label: `Pending (${songList.filter((s) => !s.status || s.status === 'pending').length})` },
                { id: 'declined', label: `Declined (${songList.filter((s) => s.status === 'declined').length})` }
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSongFilter(f.id as any)}
                  className={`px-3 py-1.5 rounded-xs transition-colors ${
                    songFilter === f.id
                      ? 'bg-[#292722] text-white font-medium shadow-xs'
                      : 'text-neutral-600 hover:text-[#292722]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Song Table */}
            <div className="bg-[#FAF7F0] rounded-sm overflow-hidden shadow-md">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#EFEAE2] border-b border-[#B59A72]/20 text-[11px] uppercase tracking-wider text-neutral-600">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Track &amp; Artist</th>
                      <th className="py-3 px-4 font-semibold">Requested By</th>
                      <th className="py-3 px-4 font-semibold">Energy Vibe</th>
                      <th className="py-3 px-4 font-semibold">DJ Status</th>
                      <th className="py-3 px-4 font-semibold">Couple Decision</th>
                      <th className="py-3 px-4 font-semibold">DJ Cue Note</th>
                      <th className="py-3 px-4 font-semibold text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#B59A72]/15">
                    {(() => {
                      const displayedSongs = songList.filter((s) => {
                        if (songFilter === 'all') return true;
                        if (songFilter === 'must-play') return s.status === 'must-play';
                        if (songFilter === 'approved') return s.status === 'approved';
                        if (songFilter === 'pending') return !s.status || s.status === 'pending';
                        if (songFilter === 'declined') return s.status === 'declined';
                        return true;
                      });

                      if (displayedSongs.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="py-16 text-center text-neutral-500">
                              <div className="max-w-md mx-auto space-y-2">
                                <div className="w-12 h-12 rounded-full bg-[#FAF7F0] border border-[#B59A72]/30 flex items-center justify-center mx-auto text-[#8C6D45]">
                                  <Music className="w-6 h-6" />
                                </div>
                                <p className="font-editorial text-lg text-[#292722] font-normal">
                                  {songList.length === 0 ? 'No Song Requests Yet' : 'No Tracks Match Filters'}
                                </p>
                                <p className="text-xs text-neutral-500 leading-relaxed">
                                  {songList.length === 0
                                    ? 'The DJ celebration playlist is currently empty. Guests can submit requests from the microsite, or you can add tracks manually.'
                                    : 'Try selecting a different filter above.'}
                                </p>
                                {songList.length === 0 && (
                                  <div className="pt-2">
                                    <button
                                      type="button"
                                      onClick={() => setShowAddSongModal(true)}
                                      className="px-4 py-2 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors inline-flex items-center gap-1.5"
                                    >
                                      <Plus className="w-3.5 h-3.5" />
                                      <span>Add First Song Request</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      }

                      return displayedSongs.map((song) => (
                        <tr key={song.id} className="hover:bg-white/60 transition-colors">
                          <td className="py-3 px-4 font-medium">
                            <span className="font-semibold text-[#292722] block text-sm">{song.songTitle}</span>
                            <span className="text-neutral-500 text-[11px]">{song.artist}</span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600">
                            <span className="font-medium text-[#8C6D45]">{song.guestName}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider bg-white border border-[#B59A72]/30 text-neutral-700">
                              {song.danceEnergy || 'high-energy'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-semibold tracking-wider ${
                                song.status === 'must-play'
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : song.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : song.status === 'declined'
                                  ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                  : 'bg-neutral-200 text-neutral-800'
                              }`}
                            >
                              {song.status === 'must-play'
                                ? '★ Must-Play'
                                : song.status === 'approved'
                                ? '✓ Approved'
                                : song.status === 'declined'
                                ? '✗ Do Not Play'
                                : '• Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleUpdateSongStatus(song.id, 'must-play')}
                                className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xs text-[10px] font-semibold flex items-center gap-1 transition-colors"
                                title="Set as Must-Play"
                              >
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>Must-Play</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateSongStatus(song.id, 'approved')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xs text-[10px] font-semibold flex items-center gap-1 transition-colors"
                                title="Approve Track"
                              >
                                <Check className="w-2.5 h-2.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateSongStatus(song.id, 'declined')}
                                className="px-2 py-1 bg-white border border-rose-300 text-rose-700 hover:bg-rose-50 rounded-xs text-[10px] font-semibold flex items-center gap-1 transition-colors"
                                title="Decline / Do not play"
                              >
                                <X className="w-2.5 h-2.5" />
                                <span>Decline</span>
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              defaultValue={song.djNotes || ''}
                              onBlur={(e) => handleUpdateSongNotes(song.id, e.target.value)}
                              placeholder="e.g. Cue for cake cutting"
                              className="px-2 py-1 text-[11px] bg-white border border-neutral-300 rounded-xs w-44"
                            />
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteSong(song.id)}
                              className="text-neutral-400 hover:text-rose-700 p-1 transition-colors"
                              title="Delete from list"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. VENUE PASS SCANNER TAB */}
        {dashboardTab === 'scanner' && (
          <div className="bg-[#FAF7F0] p-6 sm:p-8 rounded-sm border border-[#B59A72]/40 shadow-sm space-y-6">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[#8C6D45]">
                <ScanLine className="w-5 h-5" />
                Dedicated Venue Door Entrance Pass Verifier
              </div>
              <p className="text-xs text-neutral-600 mt-1 max-w-xl">
                Scan physical invitation QR codes or enter Guest Pass IDs (e.g. AUR-8012) to verify access, plus-one allocations, and record door admission timestamp.
              </p>
            </div>

            <div className="flex items-center gap-3 max-w-lg">
              <input
                type="text"
                value={scannerInput}
                onChange={(e) => setScannerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleVerifyPass(scannerInput);
                }}
                placeholder="Enter Pass ID (e.g. AUR-8012)"
                className="flex-1 px-4 py-2.5 text-sm bg-white border border-[#B59A72]/40 rounded-xs uppercase font-mono text-[#292722] focus:outline-hidden focus:border-[#8C6D45]"
              />
              <button
                type="button"
                onClick={() => handleVerifyPass(scannerInput)}
                className="px-5 py-2.5 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors whitespace-nowrap shadow-xs"
              >
                Validate Pass
              </button>
            </div>

            {scanResult && (
              <div
                className={`p-4 rounded-xs text-xs flex items-center justify-between gap-3 border ${
                  scanResult.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {scanResult.success ? (
                    <Check className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  )}
                  <span className="font-medium text-sm">{scanResult.message}</span>
                </div>
                <button
                  onClick={() => setScanResult(null)}
                  className="text-neutral-500 hover:text-neutral-900 font-mono text-sm"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        )}

        {/* 4. PRIVACY & COMPLETE DATA ERASURE TAB */}
        {dashboardTab === 'privacy' && (
          <div className="space-y-6">
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xs flex items-start gap-3">
              <Trash2 className="w-5 h-5 text-rose-700 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-rose-900">
                  Couple Data Privacy &amp; Complete Erasure Rights
                </h3>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  As the wedding couple, you have full ownership of your data under international privacy regulations (GDPR / POPIA). You may permanently erase your entire microsite, wedding configuration, guest registries, and song requests at any time.
                </p>
              </div>
            </div>

            <div className="bg-[#FAF7F0] p-6 rounded-sm border border-[#B59A72]/30 space-y-4">
              <h4 className="font-editorial text-xl text-[#292722]">
                Permanent Deletion Summary
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed">
                Executing this request will immediately purge:
              </p>
              <ul className="text-xs text-neutral-600 space-y-1.5 list-disc list-inside">
                <li>Published couple wedding microsite and URL routing</li>
                <li>All customized stationery layouts, color harmonizers, and uploaded portraits</li>
                <li>All {guests.length} guest invitation passes and RSVP decisions</li>
                <li>All plus-one accompaniment reservations and dietary records</li>
                <li>The entire {songList.length}-track DJ reception playlist and curated cues</li>
              </ul>

              <div className="pt-4 border-t border-[#B59A72]/20 flex items-center justify-between">
                <span className="text-xs text-rose-700 font-semibold">
                  Irreversible operation
                </span>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Request Complete Deletion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Song Modal */}
        {showAddSongModal && (
          <div className="fixed inset-0 z-50 bg-[#1C1B18]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#FAF7F0] rounded-sm max-w-md w-full border border-[#B59A72]/40 shadow-2xl p-6 relative">
              <button
                onClick={() => setShowAddSongModal(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 font-mono text-sm"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-[#8C6D45] mb-2">
                <Music className="w-5 h-5" />
                <span className="font-mono text-xs uppercase tracking-wider font-semibold">New Track</span>
              </div>
              <h3 className="font-editorial text-2xl text-[#292722] mb-1">
                Add Song to DJ Playlist
              </h3>
              <p className="text-xs text-neutral-600 mb-4">
                Manually queue a track into the couple&apos;s must-play dancefloor set.
              </p>

              <form onSubmit={handleAddManualSong} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">
                    Song Title <span className="text-[#8C6D45]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={manualSongTitle}
                    onChange={(e) => setManualSongTitle(e.target.value)}
                    placeholder="e.g. September"
                    className="w-full px-3 py-2 bg-white border border-[#B59A72]/40 rounded-xs text-sm"
                  />
                </div>
                <div>
                  <label className="block font-semibold uppercase text-neutral-700 mb-1">
                    Artist / Band <span className="text-[#8C6D45]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={manualSongArtist}
                    onChange={(e) => setManualSongArtist(e.target.value)}
                    placeholder="e.g. Earth Wind & Fire"
                    className="w-full px-3 py-2 bg-white border border-[#B59A72]/40 rounded-xs text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold uppercase text-neutral-700 mb-1">
                      Energy Level
                    </label>
                    <select
                      value={manualSongEnergy}
                      onChange={(e) => setManualSongEnergy(e.target.value as any)}
                      className="w-full px-2.5 py-2 bg-white border border-[#B59A72]/40 rounded-xs"
                    >
                      <option value="chill">Chill / Dinner</option>
                      <option value="mid-tempo">Mid-Tempo Groove</option>
                      <option value="high-energy">High-Energy Dance</option>
                      <option value="party-anthem">Party Anthem / Singalong</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold uppercase text-neutral-700 mb-1">
                      Requested By
                    </label>
                    <input
                      type="text"
                      value={manualSongGuest}
                      onChange={(e) => setManualSongGuest(e.target.value)}
                      placeholder="e.g. Couple Choice"
                      className="w-full px-3 py-2 bg-white border border-[#B59A72]/40 rounded-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#292722] hover:bg-[#8C6D45] text-white font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                  >
                    Add to DJ Must-Plays
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSongModal(false)}
                    className="px-4 py-2.5 border border-neutral-300 rounded-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-[#1C1B18]/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#FAF7F0] rounded-sm max-w-md w-full border border-rose-300 shadow-2xl p-6 relative">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteError(null);
                }}
                className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-800 font-mono text-sm"
              >
                ✕
              </button>

              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-3">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="font-editorial text-2xl font-normal text-rose-950 text-center mb-1">
                Confirm Complete Deletion
              </h3>
              <p className="text-xs text-neutral-600 text-center mb-4 leading-relaxed">
                This will permanently delete your wedding microsite and completely wipe all registered guests, plus-ones, and song requests from storage.
              </p>

              {deleteError && (
                <div className="mb-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xs">
                  {deleteError}
                </div>
              )}

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">
                    Type <span className="font-mono text-rose-700">DELETE</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-3 py-2 text-sm bg-white border border-rose-300 rounded-xs font-mono uppercase focus:outline-hidden focus:border-rose-700"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="flex-1 py-2.5 bg-rose-700 hover:bg-rose-800 text-white font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
                  >
                    Permanently Delete Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setDeleteError(null);
                    }}
                    className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 rounded-xs text-neutral-700 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showAddGuestModal && (
          <div className="fixed inset-0 z-50 bg-[#292722]/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-[#FAF7F0] rounded-sm max-w-md w-full border border-[#B59A72]/40 shadow-2xl p-6 relative">
              <button
                onClick={() => setShowAddGuestModal(false)}
                className="absolute top-4 right-4 text-neutral-500 hover:text-neutral-900 font-mono text-sm"
              >
                ✕
              </button>

              <h3 className="font-editorial text-2xl font-normal text-[#292722] mb-1">
                Add Invited Guest &amp; Plus-One
              </h3>
              <p className="text-xs text-neutral-600 mb-4">
                Register a new guest in the couple concierge with plus-one accommodation controls.
              </p>

              <form onSubmit={handleAddGuest} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1">
                    Primary Guest Full Name <span className="text-[#8C6D45]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    placeholder="e.g. Lord Henry Sinclair"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase tracking-wider text-[#292722] mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={newGuestEmail}
                    onChange={(e) => setNewGuestEmail(e.target.value)}
                    placeholder="guest@example.com"
                    className="w-full px-3 py-2 text-sm bg-white border border-[#B59A72]/40 rounded-xs"
                  />
                </div>

                {/* Plus-One Allocation */}
                <div className="p-3 bg-white rounded-xs border border-[#B59A72]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#292722]">
                      Allow Accompanying Plus-One (+1)
                    </span>
                    <input
                      type="checkbox"
                      id="newPlusOneCheck"
                      checked={newGuestPlusOne}
                      onChange={(e) => setNewGuestPlusOne(e.target.checked)}
                      className="accent-[#8C6D45]"
                    />
                  </div>

                  {newGuestPlusOne && (
                    <div className="pt-2 border-t border-neutral-100">
                      <label className="block text-[11px] text-neutral-600 mb-1">
                        Expected Plus-One Name (if known)
                      </label>
                      <input
                        type="text"
                        value={newPlusOneName}
                        onChange={(e) => setNewPlusOneName(e.target.value)}
                        placeholder="e.g. Lady Beatrice Sinclair"
                        className="w-full px-3 py-1.5 text-xs bg-[#FAF7F0] border border-neutral-300 rounded-xs"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#292722] hover:bg-[#8C6D45] text-white text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-sm"
                  >
                    Save &amp; Generate ID
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddGuestModal(false)}
                    className="px-4 py-2.5 border border-[#B59A72]/40 text-[#292722] rounded-xs hover:bg-[#292722]/5"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
