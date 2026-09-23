# **TypeScript Basic Guideline**

**Subtitle: Language Standards for Predictable Application Code**

## **1. Overview**

This guideline defines the fundamental TypeScript coding policy for application code.

It is framework- and runtime-agnostic, and is referenced commonly from TypeScript code across frontend and platform integration.

The goal is not to minimize code volume, but to **minimize cognitive load when reading code**.

---

## **2. Core Principles**

### **2.1 Simple is Best**

Prefer code whose flow can be followed directly over advanced abstraction.

Do not introduce abstraction merely to eliminate duplication; introduce it when it can clearly name a concept or responsibility.

### **2.2 Immutable by Default**

Do not mutate shared values or values received from outside.

When state changes are necessary, generate new values as the default approach.

Local mutation that is fully contained within a function may be used when it improves readability.

### **2.3 Functional by Default**

Separate data and behavior, and use pure functions by default.

Do not use stateful abstractions such as classes as a default style, but do not prohibit them when framework APIs or clear use cases require them.

---

## **3. TypeScript Configuration**

Enable strict mode in TypeScript.

At minimum, enable the following.

{

&nbsp;&nbsp;"compilerOptions": {

&nbsp;&nbsp;&nbsp;&nbsp;"strict": true,

&nbsp;&nbsp;&nbsp;&nbsp;"noUncheckedIndexedAccess": true,

&nbsp;&nbsp;&nbsp;&nbsp;"noImplicitReturns": true,

&nbsp;&nbsp;&nbsp;&nbsp;"exactOptionalPropertyTypes": true

&nbsp;&nbsp;}

}

&nbsp;

Do not depend only on code review for type safety; guarantee as much as possible mechanically via compiler and lint rules.

---

## **4. Variables & Data**

Use `const` by default for variable declarations.

Do not use `var`.

`let` may be used in local cases where reassignment makes the process clearer.

Use `readonly` for collections unless mutation is required.

type User = {

&nbsp;&nbsp;readonly id: string;

&nbsp;&nbsp;readonly name: string;

};

&nbsp;

type UserList = readonly User[];

&nbsp;

---

## **5. Type Definitions**

Use `type` by default in application code.

type User = {

&nbsp;&nbsp;readonly id: string;

};

&nbsp;

`interface` may be used when its capabilities are required, such as declaration merging or library/framework integration.

For fixed sets of values, use union types or `as const` objects.

export const STATUS = {

&nbsp;&nbsp;ACTIVE: 'active',

&nbsp;&nbsp;INACTIVE: 'inactive',

} as const;

&nbsp;

export type Status = (typeof STATUS)[keyof typeof STATUS];

&nbsp;

As a rule, do not use `any`.

Handle values with unknown types as `unknown`, and use them only after narrowing.

---

## **6. Functions & Control Flow**

Keep functions small and focused on one primary responsibility.

Use named arguments when there are many parameters or when boolean flags are included.

updateConfig({

&nbsp;&nbsp;enableLog: true,

&nbsp;&nbsp;timeout: 30,

});

&nbsp;

Prefer early returns in conditional branches and avoid deep nesting.

Use collection APIs such as `map` and `filter` by default, but use `for...of` when it is clearer.

Prioritize readability over any specific control-flow style.

---

## **7. External Data**

Do not trust values obtained from outside the application, such as network responses, storage, and environment variables.

Use runtime validation with tools such as Zod when needed.

const UserSchema = z.object({

&nbsp;&nbsp;id: z.string(),

&nbsp;&nbsp;name: z.string(),

});

&nbsp;

const user = UserSchema.parse(input);

&nbsp;

When dual management of schema and type is unnecessary, generate the type from the schema.

type User = z.infer<typeof UserSchema>;

&nbsp;

---

## **8. Async & Error Handling**

Use `async / await` as the default for asynchronous processing.

Distinguish between expected failures and unexpected failures.

For failures that can normally occur, such as validation or domain errors, consider treating them as values.

Do not prohibit `throw` where exceptions are natural, such as programming errors or framework boundaries.

Prioritize error-handling designs that let callers handle failures explicitly.

---

## **9. Naming & Structure**

Do not abbreviate meaning in naming.

user ✅

usr ❌

&nbsp;

index ✅

idx ❌

&nbsp;

Use the following basic naming conventions.

| Target   | Convention              |
| -------- | ----------------------- |
| Variable | camelCase               |
| Function | camelCase / Verb + Noun |
| Boolean  | is / has / can / should |
| Type     | PascalCase              |
| File     | kebab-case              |

Place related code close to its feature or responsibility.

Rather than increasing abstract `utils`, clarify the domain or feature to which code belongs.

---

## **10. Quality Gate**

Application code must pass at least the following.

Type Check

↓

Lint

↓

Test

&nbsp;

Delegate formatting to formatters and minimize human discussion over style.

The purpose of this guideline is not to eliminate specific syntax, but to maintain predictable, readable, and safe TypeScript code.
