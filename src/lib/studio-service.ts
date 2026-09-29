import type { Stream } from './data';

export interface StudioBroadcastData {
  id?: string;
  title: string;
  streamer: string;
  category: string;
  description?: string;
  thumbnailUrl?: string;
}

export interface StudioBroadcast extends Stream {
  lastHeartbeat?: number;
}

export async function startStudioBroadcast(data: StudioBroadcastData): Promise<StudioBroadcast | null> {
  try {
    const res = await fetch('/api/studio/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.broadcast || null;
  } catch (e) {
    console.warn('Failed to start studio broadcast on server:', e);
    return null;
  }
}

export async function sendStudioHeartbeat(broadcastId: string): Promise<number> {
  try {
    const res = await fetch('/api/studio/heartbeat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broadcastId }),
    });
    if (!res.ok) return 1;
    const json = await res.json();
    return json.viewersCount || 1;
  } catch (e) {
    return 1;
  }
}

export async function stopStudioBroadcast(broadcastId: string): Promise<boolean> {
  try {
    await fetch('/api/studio/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broadcastId }),
    });
    return true;
  } catch (e) {
    return false;
  }
}

export async function getActiveStudioBroadcasts(): Promise<StudioBroadcast[]> {
  try {
    const res = await fetch('/api/studio/active');
    if (!res.ok) return [];
    const json = await res.json();
    return json.broadcasts || [];
  } catch (e) {
    return [];
  }
}

export async function getStudioBroadcast(id: string): Promise<StudioBroadcast | null> {
  try {
    const res = await fetch(`/api/studio/stream?id=${encodeURIComponent(id)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.broadcast || null;
  } catch (e) {
    return null;
  }
}

// WebRTC Signaling Client APIs
export async function sendViewerOffer(broadcastId: string, viewerId: string, offer: RTCSessionDescriptionInit): Promise<boolean> {
  try {
    const res = await fetch('/api/webrtc/viewer-offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broadcastId, viewerId, offer }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function pollViewerAnswer(broadcastId: string, viewerId: string): Promise<RTCSessionDescriptionInit | null> {
  try {
    const res = await fetch(`/api/webrtc/viewer-poll?broadcastId=${encodeURIComponent(broadcastId)}&viewerId=${encodeURIComponent(viewerId)}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.answer || null;
  } catch (e) {
    return null;
  }
}

export async function pollBroadcasterOffers(broadcastId: string): Promise<Array<{ viewerId: string; offer: RTCSessionDescriptionInit }>> {
  try {
    const res = await fetch(`/api/webrtc/broadcaster-poll?broadcastId=${encodeURIComponent(broadcastId)}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.offers || [];
  } catch (e) {
    return [];
  }
}

export async function sendHostAnswer(broadcastId: string, viewerId: string, answer: RTCSessionDescriptionInit): Promise<boolean> {
  try {
    const res = await fetch('/api/webrtc/host-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broadcastId, viewerId, answer }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function sendCandidate(broadcastId: string, viewerId: string, sender: 'host' | 'viewer', candidate: RTCIceCandidateInit): Promise<boolean> {
  try {
    const res = await fetch('/api/webrtc/candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broadcastId, viewerId, sender, candidate }),
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export async function getCandidates(broadcastId: string, viewerId: string, recipient: 'host' | 'viewer'): Promise<RTCIceCandidateInit[]> {
  try {
    const res = await fetch(`/api/webrtc/candidates?broadcastId=${encodeURIComponent(broadcastId)}&viewerId=${encodeURIComponent(viewerId)}&recipient=${recipient}`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.candidates || [];
  } catch (e) {
    return [];
  }
}

export async function disconnectViewer(broadcastId: string, viewerId: string): Promise<void> {
  try {
    await fetch('/api/webrtc/viewer-disconnect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ broadcastId, viewerId }),
    });
  } catch (e) {}
}
