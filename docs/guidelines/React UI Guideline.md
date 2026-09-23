# **React UI Guideline**

**Subtitle: UI Architecture Standards for Interactive Applications**

## **1. Overview**

This guideline defines the UI architecture for interactive applications built with React.

It is especially intended for applications with high state dependency, such as dashboards, editors, and IDEs.

For TypeScript coding rules, follow `TypeScript Basic Guideline`.

For desktop runtime and Tauri-specific features, follow `Tauri Desktop Platform Guideline`.

---

## **2. Architecture**

Divide the UI into the following three layers.

| Layer | Role      | Responsibility                     |
| ----- | --------- | ---------------------------------- |
| L3    | Layout    | Placement of widgets               |
| L2    | Widget    | Integration of data/state and view |
| L1    | Pure View | Rendering UI from props            |

Use the following dependency direction.

Layout

&nbsp;&nbsp;↓

Widget

&nbsp;&nbsp;↓

Pure View

&nbsp;

Classify layers by responsibility, not by component size.

---

## **3. L1: Pure View**

A Pure View receives props and renders UI.

Allowed responsibilities are as follows.

- JSX / DOM
- Style
- Emitting event callbacks
- Pure transformations for presentation
- Conditional rendering
- UI state completed inside the component

Do not directly depend on external state such as network, global stores, or platform APIs.

type Props = {

&nbsp;&nbsp;readonly name: string;

&nbsp;&nbsp;readonly isSelected: boolean;

&nbsp;&nbsp;readonly onSelect: () => void;

};

&nbsp;

Use `readonly` for props by default.

---

## **4. L2: Widget**

A Widget connects application state and Pure View.

Main responsibilities are as follows.

- Retrieving server/async state
- Retrieving shared client state
- Executing actions
- Building view models
- Selecting loading/error/empty states
- Supplying props to Pure View

Do not make widgets responsible for complex DOM or decoration; delegate display responsibilities to L1.

---

## **5. L3: Layout**

Layout is responsible for widget placement.

Do not transform business data or update global state.

Avoid unnecessary prop drilling through layouts, and let widgets connect to required application state in an appropriate way.

---

## **6. State Management**

Separate state by nature.

### **6.1 Async Resource State**

Use TanStack Query for asynchronous resources such as API responses.

Main responsibilities are as follows.

- Fetch
- Cache
- Retry
- Refetch
- Loading / Error State

Do not perform data fetching with `useEffect + fetch` inside components.

### **6.2 Shared Client State**

Use Zustand for client state shared across multiple widgets.

Split stores by feature.

When subscribing, retrieve only the required state via selectors.

const activePanel = useEditorStore((state) => state.activePanel);

&nbsp;

### **6.3 Local UI State**

Use `useState` for temporary state completed within a component.

Examples:

- Accordion open/close
- Temporary hover/selection state
- Unsubmitted input
- Local dialog state

---

## **7. Effects**

Use `useEffect` for synchronization with external systems.

Typical examples:

- Event subscription
- Synchronization with browser APIs
- Timers
- External library lifecycle handling

Do not use `useEffect` for derived state or data transformation.

Values that can be computed during render should be computed during render.

---

## **8. Performance**

Do not use manual memoization by default.

Do not add the following without a clear need.

- `React.memo`
- `useMemo`
- `useCallback`

Introduce them locally only when a performance problem is observed and confirmed with tools such as Profiler.

Prioritize correct component boundaries and state subscription over optimization.

---

## **9. Feature Structure**

Use feature-based colocation as the default.

src/

&nbsp;&nbsp;features/

&nbsp;&nbsp;&nbsp;&nbsp;editor/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;components/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;widgets/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;hooks/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;stores/

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;api/

&nbsp;

Pure Views inside a feature should, in principle, not be referenced directly from outside that feature.

Keep feature-to-feature public APIs minimal.

---

## **10. Testing**

Separate tests according to responsibility.

### **Pure View**

Verify rendering and interaction.

### **Widget**

Verify wiring with state/API and switching of loading/error and similar states.

### **Logic / Store**

For areas testable as pure TypeScript without mounting React, use unit tests.

For application-wide E2E, follow the platform-side testing strategy.

---

## **11. Platform Boundary**

This React guideline does not define invocation methods for a specific desktop runtime or native APIs.

When Tauri-specific functionality becomes necessary, define its integration rules in `Tauri Desktop Platform Guideline`.

Do not mix React component responsibilities with platform integration responsibilities.

---

## **12. Guiding Principle**

Splitting components into small pieces is not a goal in itself.

The goal is to clarify responsibility, state ownership, and dependency, and localize the impact range of changes.

If an architecture rule makes a simple implementation unnecessarily complex, reconsider the rule itself.
