### [9/01/2026] Backend: Data Sanitization Strategy
**Challenge:** The external OpenTDB API returns data with HTML entities (e.g., `&quot;`, `&#039;`) which renders poorly on the frontend.

**Solution:** Implemented a middleware service in Python (`services.py`) using `html.unescape`.

**Reasoning:** Handling this in the backend ensures the Frontend receives "clean" JSON, adhering to the Separation of Concerns principle. The UI shouldn't worry about data formatting, only rendering.

### [10/01/2026] Frontend: State Persistence & Timer Logic
**Challenge:** The requirement mandated a 30-minute timer that persists even if the user refreshes the page.

**Solution:** Utilized `zustand` with `persist` middleware backed by `localStorage`.

**Complexity:** Handling the timer interval was tricky; putting `setInterval` inside the store would cause side effects.

**Resolution:** Decided to keep the `setInterval` in the UI component (`Timer.tsx`) which dispatches a simple `tick()` action to the store. This separates the "passage of time" (UI/Browser event) from the "calculation of remaining time" (Business Logic).