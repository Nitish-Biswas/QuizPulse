### [9/01/2026] Backend: Data Sanitization Strategy
**Challenge:** The external OpenTDB API returns data with HTML entities (e.g., `&quot;`, `&#039;`) which renders poorly on the frontend.

**Solution:** Implemented a middleware service in Python (`services.py`) using `html.unescape`.

**Reasoning:** Handling this in the backend ensures the Frontend receives "clean" JSON, adhering to the Separation of Concerns principle. The UI shouldn't worry about data formatting, only rendering.