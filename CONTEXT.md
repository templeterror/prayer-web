# Iqama — Product Context

## Product

**Iqama** is an iOS app (iOS 16+, SwiftUI, local-only v1, no backend).

## Core concept

Blocks distracting apps during the five daily Islamic prayer (salah) windows using Apple's Screen Time / FamilyControls framework. When a prayer window opens, the user's chosen apps lock. To unlock, the user confirms they prayed. This builds a daily streak.

## Target user

Practicing Muslims who want their phone to support prayer habits instead of distracting from them.

## Key mechanics

- **Five prayers:** Fajr, Dhuhr, Asr, Maghrib, Isha.
- **Prayer times** calculated locally from the user's location (no external API). Supports **MWL, ISNA, Egyptian, and Umm al-Qura** calculation methods, plus **Shafi/Hanafi** Asr.
- During each prayer window, selected apps are blocked via a system shield screen ("Did you pray?").
- **"I prayed"** → unlocks apps + counts toward streak.
- **"Unlock 5 min"** → free escape hatch; unlocks temporarily, does **NOT** break the streak.
- **Streak** = consecutive calendar days with at least one prayer marked.

## Differentiators / honest constraints (do not overstate)

- iOS only.
- Local-only: no accounts, no cloud, no tracking. **Privacy is a genuine selling point.**
- v1 does **not** include notifications, Android, or cloud sync.
- Requires Apple's Family Controls distribution entitlement; works only on physical devices.

## Tone

Spiritual but not preachy; modern, calm, habit-focused.
