# 📝 README er Question gulo – Answer (Bunglish e)

*Ei answers gulo tumi nijer bujh theke likhe README te use korte paro. Copy-paste na kore nijer vab e likho – assignment e bola ache "on your own" answer korte.*

---

## 1️⃣ What is the difference between var, let, and const?

**Answer (Bunglish):**

- **var:** Eta purono system. Eta **function-scoped** – matlab function er moddhe jekono jaygay declare korle oi function er bitor e kothao use kora jay. Block (ja { } er moddhe) er baireo access paba. Ar **re-declare** o kora jay same name e. Eta theke bug ase, tai ajkal let/const use kora valo.

- **let:** Eta **block-scoped** – matlab jodi `if` ba `for` er moddhe declare koro, shei block er baire theke access pabe na. **Re-assign** kora jay (value change), kintu same scope e **re-declare** kora jabe na. Modern code e variable er jonno let use kora standard.

- **const:** O **block-scoped**, kintu **re-assign** kora jabe na – value ta fix thake. Kintu jodi value ta object ba array hoy, tahole object/array er **bitorer** property change kora jay (const ta khud change hoy na). Jemon jinis change hobe na seta lock korar jonno const use koro.

**Short:** var = purono, function-scoped; let = block-scoped, value change kora jay; const = block-scoped, value change kora jay na (reference lock).

---

## 2️⃣ What is the spread operator (...)?

**Answer (Bunglish):**

Spread operator hocche **three dots (...)**. Eta diye kono **array** ba **object** ke “bilaye” dewa jay – matlab tar sob element ba property alada alada vabe use kora jay.

- **Array e:**  
  `const newArr = [...oldArr];` – oldArr er copy, alada array.  
  `const combined = [...arr1, ...arr2];` – duita array ek sathe milano.

- **Object e:**  
  `const newObj = { ...oldObj };` – object copy.  
  `const updated = { ...user, name: 'Rahim' };` – user er copy kore just `name` ta update.

Eta diye **immutable** vabe kaj kora easy – original array/object change na kore notun ta banano. Function e multiple argument pathateo array theke spread kora jay: `fn(...arr)`.

---

## 3️⃣ What is the difference between map(), filter(), and forEach()?

**Answer (Bunglish):**

- **forEach():** Array er **protita element** er upor ekta kaj kora (loop). Kono **return** kore na – shudhu side effect er jonno (jaise console.log, DOM update). Result hisebe kichu pabe na.

- **map():** Protita element er upor ekta **transformation** kore **notun array** return kore. Jemon: number array theke double kora array, ba array of object theke shudhu name er array. Length same thake, value change hoy.

- **filter():** Array theke **condition onujayi** kichu element **rekhe** baki bad diye **notun array** return kore. Jemon: shudhu even number, ba status === 'open' emon issues. Length kom hoy, element same thakte pare kintu count kom.

**Short:** forEach = loop, kichu return na; map = protita ke transform kore notun array; filter = condition e pass na kora gulo bad diye notun array.

---

## 4️⃣ What is an arrow function?

**Answer (Bunglish):**

Arrow function hocche function likhar **ekta short syntax** (=> use kore).  
Example:  
`const add = (a, b) => a + b;`  
eta same:  
`function add(a, b) { return a + b; }`

- **Syntax:** `(param) => expression` – jodi body e shudhu ek line hoy, return likhte hoy na. Multi-line hole: `(param) => { ... return value; }`.

- **this er farak:** Normal function er `this` kon object theke call hocche seta theke decide hoy. Arrow function er `this` **surrounding scope** theke ashe (lexical this) – tai event listener ba callback e kichu somoy arrow use kora comfortable.

- **Use:** Short callback, map/filter er moddhe, promise/callback e onek use hoy. Kintu jodi method er moddhe `this` chai (object er property), tahole normal function o use korte hoy.

---

## 5️⃣ What are template literals?

**Answer (Bunglish):**

Template literal hocche **backtick (`)** diye lekha string, jate **variable** ba **expression** directly **${ }** er moddhe diye dewa jay. Eta diye string concat (+ use) kora lagena.

- **Example:**  
  `const name = 'Karim';`  
  `const msg = \`Hello, ${name}!\`;` → "Hello, Karim!"

- **Expression o:**  
  `\`Total: ${a + b}\`` – calculation o vetore dewa jay.

- **Multi-line:** Backtick er moddhe line break diye direct multi-line string likha jay, \n lagena.

Eta diye string onek readable hoy ar dynamic value add kora easy – HTML banate, API URL banate, message banate onek use hoi.

---

*Ei answers gulo nijer moto kore likhe README te add koro – assignment requirement onujayi "on your own" answer dite hobe, copy-paste na.*
