# 🎓 Výuková platforma pro SQL s herními prvky

Tento projekt je interaktivní webová aplikace postavená v Reactu, která slouží k výuce a procvičování databázového jazyka SQL zábavnou formou. Místo nudných tabulek a suché teorie nabízí studentům tematické minihry, ve kterých řeší problémy pomocí SQL dotazů.

## 🎮 Dostupné minihry

### ⛏️ SQLCraft
Základní modul inspirovaný fenoménem Minecraft. Hráč se ocitá v kostičkovaném světě a pomocí SQL dotazů musí například zjistit, kolik má v inventáři surovin, nebo vyfiltrovat nepřátelské moby.

### 💻 Escape from TUL
Pokročilejší modul s hackerskou tematikou zasazený do prostředí Technické univerzity v Liberci (TUL). Hráč v roli studenta musí proniknout do univerzitního systému (STAG) přes simulovaný zelený terminál.

## 🛠️ Použité technologie

* **Frontend:** React.js (funkcionální komponenty, hooks)
* **Stylování:** Čisté CSS
* **Databáze (Klient):** `sql.js` (WebAssembly port SQLite) - databáze běží kompletně v prohlížeči uživatele.
* **Backend / Logování:** Supabase - ukládání historie dotazů, úspěšnosti a chyb pro analytické účely.

## 🚀 Instalace a spuštění (Local Setup)

Pro spuštění projektu na svém počítači postupuj podle následujících kroků:

1. **Naklonování repozitáře**
   ```
   bash
   git clone "https://github.com/MarekProchazka12/fm-sql-games.git"
   cd /fm-sql-games
   ```

2. **Instalace závislostí**
    ```
    npm install
    ```

3. **Nastavení proměnných prostředí (Environment Variables)**
Projekt využívá Supabase pro logování. Vytvoř v kořenovém adresáři soubor .env.local a vlož do něj své přístupové údaje:
    ```
    VITE_SUPABASE_URL=projekt_url
    VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=anon_key
    ```

4. **Spuštění vývojového serveru**
    ```
    npm run dev
    ```