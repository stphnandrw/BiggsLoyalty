---
name: pare
description: 'Quick checklist to manually optimize a slow React Native Expo app. Use for startup lag, slow navigation, list jank, API wait time, and unnecessary re-renders. Produces prioritized fixes and before/after metrics.'
argument-hint: 'Describe where the app feels slow (screen, action, and device type).'
user-invocable: true
---

# Manual App Performance Optimization

## Scope
- React Native Expo app only
- Focus on manual optimization, minimal tooling overhead

## Default Targets
- Cold start under 3.0s
- Warm start under 1.5s
- Screen load/transition under 1 to 2s
- UI feedback within 300ms of user action
- Consistent 60 fps with no visible jank

## When To Use
- App startup feels slow
- Screen navigation stutters or freezes
- Lists drop frames while scrolling
- Buttons feel delayed after tap
- Data-heavy screens show spinners too long
- You want fast, repeatable manual optimization passes

## Quick Checklist
1. Reproduce one slow path 3 times with the exact same steps.
2. Write baseline medians for launch, transition, and API-to-render.
3. Classify bottleneck:
   - startup/render/asset
   - navigation/mount
   - list virtualization/re-render
   - network/data transform
4. Apply one high-impact low-risk fix at a time.
5. Re-test 3 times and compare medians.
6. Keep only changes that improve speed and keep behavior correct.

## Fix Menu By Bottleneck

### Startup Or Navigation
- Defer non-critical work until after first paint.
- Lazy-load non-critical screens/components.
- Remove heavy synchronous work in initial route mount.
- Preload only first-screen assets.

### Lists Or Interaction Jank
- Tune `FlatList`/`SectionList` (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`).
- Add `getItemLayout` for fixed-height items.
- Ensure stable unique keys for each row.
- Keep row components small; memoize where it clearly reduces rerenders.

### Re-render Pressure
- Use `useMemo` for expensive derived values.
- Use `useCallback` only where handler identity causes child rerenders.
- Avoid inline object/array/function creation in hot paths.
- Split heavy screens into smaller memoized subcomponents.

### API-To-Render Delay
- Remove duplicate requests and request waterfalls.
- Fetch only required fields and paginate large payloads.
- Cache repeatable responses when appropriate.
- Parse/transform large payloads once, then reuse.

## Prioritization Rules
- Pick fixes with high impact and low refactor risk first.
- Prefer local optimizations before architectural rewrites.
- Change one variable at a time when measuring.
- If no measurable gain after 2 focused attempts, reclassify bottleneck.

## Output Format For Each Optimization Session
- Slow path: [screen + action]
- Baseline: [metric table]
- Bottleneck class: [primary/secondary]
- Changes applied: [short bullet list]
- Result: [before vs after medians]
- Keep/Revert decision: [and why]
- Next candidate: [if target not yet met]

## Definition Of Done
- Target flow meets or moves clearly toward default targets
- No functional regressions on tested paths
- Notes are documented so another dev can repeat the process
