**Live Link:** [https://saddamtkg.github.io/GitHub-Issue-Tracker-B13A5-Saddam/](https://saddamtkg.github.io/GitHub-Issue-Tracker-B13A5-Saddam/)


# README er question ar answer

## 1. What is the difference between var, let, and const?

- **var:** Eta purono system. Eta function-scoped – orthat function er moddhe jekono jaygay declare korle oi function er bitor e kothao use kora jay. Block er baireo access paba. Ar same name e abar declare o kora jay. Eta theke bug ase, tai ajkal let/const use kora valo.

- **let:** Eta block-scoped – jodi if ba for er moddhe declare kori, shei block er baire theke access pabe na. Value re-assign kora jay, kintu same scope e abar declare kora jabe na. Modern code e variable er jonno let use kora standard.

- **const:** O block-scoped, kintu re-assign kora jabe na – value fix thake. Kintu value jodi object ba array hoy, tahole object/array er bitorer property change kora jay (const ta nijei change hoy na). Jeta change hobe na seta lock korar jonno const use kori.

**Short:** var = purono, function-scoped; let = block-scoped, value change kora jay; const = block-scoped, value change kora jay na.

---

## 2. What is the spread operator (...)?

Spread operator hocche tin dot (...). Eta diye array ba object ke “milaye” dewa jay – tar sob element ba property alada alada vabe use kora jay.

- **Array te:**
  `const newArr = [...oldArr];` – oldArr er copy, alada array.
  `const combined = [...arr1, ...arr2];` – duita array ek sathe milano.

- **Object e:**
  `const newObj = { ...oldObj };` – object copy.
  `const updated = { ...user, name: 'Rahim' };` – user er copy kore sudhu name ta update.

Eta diye original change na kore notun banano easy – immutable vabe kaj kora jay. Function e argument pathateo array theke spread kora jay.

---

## 3. What is the difference between map(), filter(), and forEach()?

- **forEach():** Array er protita element er upor ekta kaj kora – bas loop. Kono kichu return kore na. Sudhu side effect er jonno use kori – emon console.log, DOM update. Result hisebe kichu pabe na.

- **map():** Protita element er upor transformation kore notun array return kore. Emon number array theke double kora array, ba object array theke sudhu name er array. Length same thake, value change hoy.

- **filter():** Array theke condition onujayi kichu element rekhe baki bad diye notun array return kore. Emon sudhu even number, ba status === 'open' emon issues. Length kom hoy.

**Short:** forEach = loop, kichu return na; map = protita ke transform kore notun array; filter = condition e pass na kora gulo bad diye notun array.

---

## 4. What is an arrow function?

Arrow function hocche function likhar short syntax – (=>) use kore.

Example:
`const add = (a, b) => a + b;`
eta ei rokom:
`function add(a, b) { return a + b; }`

- **Syntax:** (param) => expression – body te sudhu ek line hole return likhte hoy na. Multi-line hole: (param) => { ... return value; }.

---

## 5. What are template literals?

Template literal hocche backtick (`) diye lekha string, jate variable ba expression directly ${ } er moddhe diye dewa jay. Eta diye string er jonno plus diye concat kora lagena.

- **Example:**
  `const name = 'Karim';`
  `const msg = \`Hello, ${name}!\`;` → "Hello, Karim!"

- **Expression o:**
  \`Total: ${a + b}\` – calculation o vetore dewa jay.

- **Multi-line:** Backtick er moddhe line break diye direct multi-line string likha jay, \n lagena.

Eta diye string readable hoy ar dynamic value add kora easy – HTML banate, API URL, message onek jagay use hoi.

---
