# **Frontend Testing Guideline**

**Subtitle: Testing Standards for React Web UI**

## **1. Overview**

This guideline defines the testing policy for the React frontend application.

Testing is separated into the following three categories.

Automated Test

&nbsp;&nbsp;&nbsp;&nbsp;↓

AI Runtime Validation

&nbsp;&nbsp;&nbsp;&nbsp;↓

Human Visual Review

&nbsp;

Each category has a different responsibility, and the same concern must not be redundantly verified across multiple layers.

In the initial version, only frontend verification in a Linux development environment is in scope.

Verification specific to Windows and the Tauri production runtime is out of scope.

---

## **2. Principles**

### **2.1 Test Behavior, Not Implementation**

Test externally observable input, output, and behavior, not internal implementation.

Prioritize tests that do not break unnecessarily as long as behavior remains unchanged after refactoring.

### **2.2 Test at the Lowest Responsible Layer**

Test each behavior at the simplest layer that can verify it correctly.

Do not retest logic in upper layers when it is already guaranteed in lower layers.

### **2.3 Test from the User Perspective**

For React components, verify rendering and interaction observable by users.

When querying elements, prioritize semantic information such as role, label, and accessible name.

Avoid dependencies on CSS classes, DOM structure, or internal state.

### **2.4 Real Browser Complements Unit Tests**

Use jsdom to verify logic and DOM interaction.

Use Chrome to verify actual rendering, network behavior, and browser runtime behavior.

---

# **3. Test Stack**

Use the following as the initial standard.

| Purpose                 | Tool                          |
| ----------------------- | ----------------------------- |
| Test Runner             | Vitest                        |
| TypeScript / Logic      | Node Environment              |
| React / DOM Environment | jsdom                         |
| React Component         | React Testing Library         |
| User Interaction        | `@testing-library/user-event` |
| DOM Assertion           | `@testing-library/jest-dom`   |
| Runtime Validation      | Google Chrome                 |
| AI Browser Inspection   | Chrome DevTools for Agents    |
| Visual Review           | Human                         |

Browser automation frameworks such as Playwright are not included in the initial standard.

Consider adding them only when a concrete need arises.

---

## **4. Testing Library**

Use React Testing Library as the standard for React component tests.

Its role is shown below.

Vitest

&nbsp;&nbsp;&nbsp;&nbsp;↓

jsdom

&nbsp;&nbsp;&nbsp;&nbsp;↓

React Testing Library

&nbsp;&nbsp;&nbsp;&nbsp;↓

Rendered UI

&nbsp;

When querying elements, prioritize semantic queries such as `getByRole` and `getByLabelText`.

Example:

screen.getByRole('button', { name: 'Save' });

&nbsp;

Use `data-testid` only when an element cannot be identified semantically.

As a rule, use `@testing-library/user-event` for user interaction.

const user = userEvent.setup();

&nbsp;

await user.click(

&nbsp;&nbsp;screen.getByRole('button', { name: 'Save' }),

);

&nbsp;

---

# **5. Pure TypeScript**

Intensively automate tests for pure functions, data transformation, validation, and similar logic.

Typical targets:

- Domain Logic
- Calculation
- Formatter
- Parser
- Selector
- Zod Schema
- State Transition

Use Node as the execution environment.

Do not verify logic that does not require a browser or React via component tests.

---

# **6. API Layer**

Test functions responsible for communication with external APIs in isolation.

Main verification targets:

- Request URL / Parameter / Body
- Response Conversion
- Runtime Validation
- HTTP Error
- Invalid Response

Mock the network and do not connect to real internet APIs in regular unit tests.

Verify CORS, actual requests, and browser-specific network behavior in Chrome runtime validation.

---

# **7. State Management**

For stores such as Zustand, test without mounting React components whenever possible.

Initial State

&nbsp;&nbsp;&nbsp;&nbsp;↓

Action

&nbsp;&nbsp;&nbsp;&nbsp;↓

Expected State

&nbsp;

Verify selectors and state transitions.

UI rendering is not the responsibility of store tests.

---

# **8. L1: Pure View**

For Pure View tests, use Vitest + jsdom + React Testing Library.

Do not require tests for every component.

Main targets:

- User Interaction
- Callback
- Conditional Rendering
- Accessibility-critical states
- Complex UI State

There is no need to mechanically add tests to components that only display props.

Color, pixel position, font rendering, and detailed layout are not targets of component tests; verify them in a real browser.

---

# **9. L2: Widget**

In widget tests, verify integration between application state and view.

Main targets:

Loading → Loading View

&nbsp;

Error → Error View

&nbsp;

Success → Content View

&nbsp;

User Action → Expected Action

&nbsp;

Use Vitest + jsdom + React Testing Library.

Test API function internals and store state transitions at lower layers.

In widget tests, focus on whether wiring is correct.

For asynchronous rendering, do not use fixed-time sleeps; wait for the expected UI state.

expect(

&nbsp;&nbsp;await screen.findByRole('heading', { name: 'Dashboard' }),

).toBeInTheDocument();

&nbsp;

---

# **10. L3: Layout & Routes**

As a rule, do not write detailed DOM unit tests for layouts and routes.

Verify whole-application composition through Chrome runtime validation.

If there is pure route logic or parameter transformation, isolate only that logic and unit test it.

Main runtime validation targets:

- The expected screen is shown from each route
- Major widgets are present
- Navigation works
- There is no obvious layout breakage

---

# **11. AI Runtime Validation**

Use Google Chrome on Linux for real-browser validation.

Vite Dev Server

&nbsp;&nbsp;&nbsp;&nbsp;↓

Google Chrome

&nbsp;&nbsp;&nbsp;&nbsp;↓

Chrome DevTools

&nbsp;&nbsp;&nbsp;&nbsp;↓

AI Agent

&nbsp;

The AI agent operates and observes the application directly.

At minimum, verify the following.

### **Rendering**

- The target page is displayed
- Major components are present
- No error screen is shown

### **Interaction**

- Primary actions can be executed
- State transitions to the expected result after actions
- Navigation works

### **Console / Network**

- No uncaught errors
- No critical warnings
- Required API requests succeed
- No CORS errors

### **Layout**

- No obvious overflow or overlap
- Interactive targets are not lost outside the viewport

AI runtime validation does not make final judgments on visual design quality.

---

# **12. Human Visual Review**

In human review, visually inspect actual Chrome rendering.

Main targets:

- Layout
- Typography
- Spacing
- Color
- Visual Hierarchy
- Animation
- User Experience

There is no requirement to repeatedly revalidate business logic that is already guaranteed by automated tests or AI validation.

---

# **13. Standard Verification Flow**

For ordinary changes, verify in the following order.

Type Check

&nbsp;&nbsp;&nbsp;&nbsp;↓

Lint

&nbsp;&nbsp;&nbsp;&nbsp;↓

Vitest

&nbsp;&nbsp;&nbsp;&nbsp;↓

Vite Development Server

&nbsp;&nbsp;&nbsp;&nbsp;↓

AI Chrome Validation

&nbsp;&nbsp;&nbsp;&nbsp;↓

Human Visual Review

&nbsp;

For logic-only changes, browser validation may be omitted.

For UI-affecting changes, perform AI Chrome validation.

For visual-appearance changes, perform human visual review.

---

# **14. Responsibility by Layer**

| Layer             | Primary Test                     | Browser Validation        |
| ----------------- | -------------------------------- | ------------------------- |
| Pure Logic        | Vitest / Node                    | Not Required              |
| Schema            | Vitest / Node                    | Not Required              |
| API Function      | Vitest / Node                    | Network Integration Only  |
| Store             | Vitest / Node                    | Not Required              |
| L1 Pure View      | Vitest / jsdom / Testing Library | Visual / Browser Behavior |
| L2 Widget         | Vitest / jsdom / Testing Library | Main Interaction          |
| L3 Layout         | None as a rule                   | Chrome                    |
| Routes            | Logic only in Vitest             | Chrome                    |
| Whole Application | None                             | AI + Human                |

---

# **15. Test Dependency Policy**

Keep test infrastructure minimal.

Use the following as the initial standard.

Vitest

-

jsdom

-

React Testing Library

-

@testing-library/user-event

-

@testing-library/jest-dom

-

Chrome DevTools for Agents

&nbsp;

Do not introduce browser automation, visual regression, or dedicated network mocking frameworks until a concrete need is confirmed.

When introducing a new testing tool, clarify the behavior that cannot be guaranteed with existing means.

Snapshot testing is not the default approach for component testing.

---

# **16. Guiding Principle**

The goal of frontend testing is not to maximize the number of tests or coverage percentage.

Guarantee important behavior at the most suitable layer with minimal complexity.

Logic

&nbsp;&nbsp;&nbsp;&nbsp;→ Automated Test

&nbsp;

Integration

&nbsp;&nbsp;&nbsp;&nbsp;→ Automated Test + Runtime Validation

&nbsp;

Rendering

&nbsp;&nbsp;&nbsp;&nbsp;→ AI Runtime Validation

&nbsp;

Visual Quality

&nbsp;&nbsp;&nbsp;&nbsp;→ Human Review

&nbsp;

Prioritize preventing test infrastructure itself from becoming more complex than application development.
