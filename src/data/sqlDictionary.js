export const sqlDictionary = {
    SELECT: 'Základní příkaz pro čtení dat. Říká databázi, aby ti ukázala zadané konkrétní sloupce. Znak hvězdičky (*) znamená, aby ti ukázala úplně všechny sloupce.',
    FROM: 'Určuje zdroj dat. Říkáš tím, ze které tabulky (nebo tabulek) má databáze ty sloupce vytáhnout.',
    WHERE: 'Funguje jako síto. Zadrží všechny řádky, které nesplňují tvou podmínku, a propustí jen ty správné.',
    AS: 'Slouží k dočasnému přejmenování (tzv. alias). Můžeš si tak zkrátit dlouhý název tabulky nebo přesněji pojmenovat výsledný sloupec',
    DISTINCT:
        "Čistič duplicit. Zaručí, že ve výsledku bude každá hodnota pouze jednou. Pokud máš v tabulce desetkrát 'Kámen', DISTINCT ti vrátí řádky se slovem 'Kámen' jen jednou.",
    AND: 'Logická spojka A ZÁROVEŇ. Řádek se zobrazí jen tehdy, když budou splněny všechny spojené podmínky současně.',
    OR: 'Logická spojka NEBO. Řádek se zobrazí, pokud splňuje alespoň jednu z daných podmínek.',
    IN: "Zkratka pro více podmínek. Místo psaní 'id = 1 OR id = 2 OR id = 3' napíšeš jednoduše 'id IN (1,2,3)'. Můžeš to také použít pro robustnější výběry.",
    BETWEEN:
        "Hledá hodnoty v určitém rozsahu (včetně krajních hodnot). Například 'BETWEEN 10 AND 20' najde všechny hodnoty od desítky do dvacítky.",
    LIKE: "Textový vyhledávač. Hledá pouze podle vzoru pomocí zástupných znaků. Znak '%' znamená 'libovolný počet znaků'. Ku příkladu LIKE 'Zom%' najde výskyt slova 'Zombie' i 'Zombík'.",
    'IS NULL':
        'Ptá se, jestli je hodnota úplně prázdná. Pozor, prázdná hodnota (NULL) není to samé jako nula nebo prázdný text.',
    NOT: 'Logický obraceč (negace). Otočí podmínku naruby. Můžeš tak hledat například záznamy, které v seznamu nejsou (NOT IN) nebo políčka, která nejsou prázdná (IS NOT NULL).',
    'ORDER BY':
        'Seřadí výsledné řádky podle vybraného sloupce. Můžeš řadit libovolně podle abecedy, čísel, datumů,...',
    ASC: "Jedná se o doplněk k ORDER BY. Znamená 'Ascending' (vzestupně). Řadí třeba od A do Z, nebo od nejmenšího čísla po to největší.",
    DESC: "Jedná se taktéž o doplněk k ORDER BY. Znamená 'Descending' (sestupně). Seřadí vybrané řádky od Z do A, nebo od největšího čísla po nejmenší.",
    LIMIT: 'Ořízne výsledek pouze na určitý počet řádků. Například LIMIT 5 ti ukáže jen prvních 5 výsledků.',
    JOIN: 'Spojuje dvě různé tabulky dohromady na základě společného údaje (většinou ID). Používá se, když máš data rozsekaná na více místech a potřebuješ je dát dohromady.',
    ON: 'Pravidlo pro JOIN. Přesně určuje, které sloupce se mají použít jako lepidlo ke spojení tabulek (např. ON hrac.id = inventar.hrac_id).',
    'INNER JOIN':
        'Je to naprosto to samé jako obyčejný JOIN. Slovo INNER se tam může napsat navíc, aby bylo jasné, že hledáš pouze ty řádky, které mají záznam v obou spojovaných tabulkách.',
    'LEFT JOIN':
        'Funguje jako normální JOIN, ale s jedním rozdílem: vezme VŠECHNY řádky z první (levé) tabulky. Pokud k nim nenajde odpovídající data ve druhé tabulce, doplní tam prázdno (NULL).',
    'RIGHT JOIN':
        'Funguje jako normální JOIN, ale s jedním rozdílem: vezme VŠECHNY řádky z druhé (pravé) tabulky. Pokud k nim nenajde odpovídající data v první tabulce, doplní tam prázdno (NULL).',
    'CROSS JOIN':
        'Utvoří kartézský součin mezi dvěma tabulkami a přiřadí každý řádek přesně ke všem řádkům z druhé tabulky.',
    'GROUP BY':
        'Seskupuje řádky a vezme všechny záznamy, které mají v daném sloupci stejnou hodnotu, a zdrcne je do jedné skupiny. Je NUTNÉ při používání agregačních funkcí.',
    HAVING: "Funguje úplně stejně jako WHERE, ale používá se až po seskupení pomocí GROUP BY. Slouží k filtrování celých skupin a agregací (např. 'ukaž jen ty skupiny, kde je součet větší než 100').",
    COUNT: 'Agregační funkce. Spočítá, kolik řádků dotaz našel. Často se zapisuje jako COUNT(*).',
    SUM: 'Agregační funkce. Sečte všechny číselné hodnoty v daném sloupci dohromady.',
    AVG: 'Agregační funkce. Vypočítá matematický průměr z čísel v daném sloupci.',
    MAX: 'Agregační funkce. Najde absolutně největší hodnotu (nebo nejzazší datum / poslední slovo v abecedě) v daném sloupci.',
    MIN: 'Agregační funkce. Najde absolutně nejmenší hodnotu v daném sloupci.',
    UNION: 'Vytvoří sjednocení. Dá výsledky dvou různých dotazů pod sebe do jedné velké tabulky. Zároveň také maže duplicitní výsledky.',
    INTERSECT:
        'Vytvoří průnik. Dá pouze výsledky dvou různých dotazů, které se vyskytují v obou z nich.',
    EXCEPT: 'Funguje jako odečítání množin. Vrátí to, co našel první dotaz, ale odečte od toho vše, co našel druhý dotaz.',
    EXISTS: 'Používá se pro poddotazy. Zkontroluje, jestli poddotaz našel alespoň jeden jediný řádek. Pokud ano, propustí hlavní dotaz dále.',
    IFNULL: 'Záchranná brzda. Zkontroluje hodnotu, a pokud je prázdná (NULL), nahradí ji něčím jiným, co si určíš. Například IFNULL(mnozstvi, 0) zajistí, že místo prázdného políčka uvidíš nulu.',
    'UNION ALL':
        'Podobné jako UNION (spojí tabulky pod sebe), ale s jedním obrovským rozdílem, že nemaže duplikáty. Nechá tam úplně všechny řádky přesně tak, jak je dotazy našly.',
    CASE: "Funguje jako programátorské 'když se stane toto, udělej tamto'. Umožňuje ti měnit zobrazené hodnoty podle podmínek (např. CASE WHEN health < 10 THEN 'Umírá' ELSE 'Zdravý' END).",
};
