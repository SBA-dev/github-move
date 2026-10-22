"""Leçons de sciences et technologie, du CP au CM2."""
from build_bibliotheque import lecon, bulles, classer, ordre, lecture

S = "sciences"
C2 = "c2-sciences-technologie-{}-{}"
C3 = "c3-sciences-technologie-{}-{}"

LECONS = [
    # ---------------- CP ----------------
    lecon("sc-cp-vivant", S, "CP", "Vivant ou non vivant ?", 10, C2.format("cp", "unite-et-diversite-du-vivant"),
          ["vivant"],
          ["Un être vivant naît, se nourrit, grandit, peut avoir des petits, puis meurt.",
           ("Les animaux et les plantes sont des êtres vivants. Une pierre ou un jouet ne sont pas vivants.", ["un chien", "un arbre", "une pierre"])],
          [classer("Vivant ou non vivant ?", "Range chaque chose dans la bonne maison.", {
              "Vivant": ["un chat", "une fleur", "un poisson", "un arbre"], "Non vivant": ["un caillou", "une voiture", "un ballon", "une chaise"]}),
           bulles("Pourquoi ?", [
               ("Qu'est-ce qu'un être vivant fait ?", ["il grandit", "il roule", "il brille"]),
               ("Une plante est-elle vivante ?", ["Oui", "Non"], "Elle naît d'une graine, elle boit de l'eau, elle grandit.")])],
          competence="Je distingue le vivant et le non-vivant", citation_exacte="L'élève justifie son tri en utilisant des critères simples, tels que la mobilité, la croissance, la reproduction, l'alimentation, la perception."),
    lecon("sc-cp-solide-liquide", S, "CP", "Solide ou liquide ?", 20, C2.format("cp", "etats-physiques-de-la-matiere"),
          ["solide", "liquide"],
          [("Un solide garde sa forme : un caillou, un glaçon. On peut le prendre dans la main.", ["caillou", "glaçon"]),
           ("Un liquide coule et prend la forme du récipient : l'eau, le lait, le jus.", ["eau", "lait", "jus"])],
          [classer("Solide ou liquide ?", "Range chaque matière.", {
              "Solide": ["le bois", "un glaçon", "le sable", "une cuillère"], "Liquide": ["l'eau", "le lait", "l'huile", "le sirop"]}),
           bulles("Que se passe-t-il ?", [
               ("Un glaçon au soleil…", ["fond et devient de l'eau", "grossit", "reste pareil"]),
               ("De l'eau au congélateur…", ["devient de la glace", "disparaît", "devient du lait"])])],
          competence="Je reconnais un solide et un liquide", citation_exacte="L'élève identifie l'état physique de l’eau (solide ou liquide)"),
    lecon("sc-cp-alimentation", S, "CP", "Bien manger", 30, C2.format("cp", "alimentation"),
          ["aliments", "alimentation"],
          [("Pour bien grandir, on mange de tout : des fruits et légumes, des féculents, des produits laitiers, de la viande, du poisson ou des œufs.", ["pomme", "pâtes", "yaourt", "poisson"]),
           "Les bonbons et les sodas, c'est seulement de temps en temps. Et on boit de l'eau."],
          [classer("Les familles d'aliments", "Range chaque aliment dans sa famille.", {
              "Fruits et légumes": ["une pomme", "une carotte", "des haricots"], "Féculents": ["du pain", "des pâtes", "du riz"],
              "Produits laitiers": ["du lait", "un yaourt", "du fromage"]}),
           bulles("Bon pour la santé ?", [
               ("Quelle boisson choisir à chaque repas ?", ["de l'eau", "du soda", "du sirop"]),
               ("Pour le goûter, quel est le meilleur choix ?", ["un fruit et du pain", "des bonbons", "des chips"])])],
          competence="Je connais les familles d'aliments", citation_exacte="Découvrir et nommer les catégories d'aliments"),
    lecon("sc-cp-hygiene", S, "CP", "Se laver les mains", 40, C2.format("cp", "sante-et-hygiene-de-vie"),
          ["hygiène", "mains", "laver"],
          ["Les microbes sont si petits qu'on ne les voit pas. Ils peuvent nous rendre malades.",
           "Pour les chasser, on se lave les mains avec du savon, avant de manger et après être allé aux toilettes."],
          [ordre("Bien se laver les mains", "Remets les étapes dans l'ordre.", ["Mouiller ses mains", "Prendre du savon", "Frotter partout, entre les doigts", "Rincer à l'eau", "Sécher avec une serviette propre"]),
           bulles("Quand se laver les mains ?", [
               ("Quand faut-il se laver les mains ?", ["avant de manger", "avant de dormir seulement", "jamais"]),
               ("Avec quoi se lave-t-on les mains ?", ["de l'eau et du savon", "du sable", "de l'eau seulement"])])],
          competence="Je sais bien me laver les mains"),

    # ---------------- CE1 ----------------
    lecon("sc-ce1-regimes-alimentaires", S, "CE1", "Que mangent les animaux ?", 10, C2.format("ce1", "nutrition-des-etres-vivants"),
          ["nourrit", "alimentation", "animaux"],
          [("Les herbivores mangent des plantes. Les carnivores mangent d'autres animaux. Les omnivores mangent de tout.", ["vache : herbivore", "loup : carnivore", "ours : omnivore"])],
          [classer("Le régime des animaux", "Range chaque animal selon ce qu'il mange.", {
              "Herbivore": ["la vache", "le lapin", "le cheval"], "Carnivore": ["le lion", "le loup", "le requin"], "Omnivore": ["l'ours", "le cochon", "la poule"]}),
           bulles("Qui mange quoi ?", [
               ("Que mange une chenille ?", ["des feuilles", "des souris", "du poisson"]),
               ("Le renard est…", ["carnivore", "herbivore"])])],
          competence="Je connais le régime alimentaire des animaux"),
    lecon("sc-ce1-electricite", S, "CE1", "L'électricité et le danger", 20, C2.format("ce1", "l-electricite"),
          ["électri", "circuit", "lampe"],
          [("Pour qu'une lampe s'allume, il faut un circuit fermé : une pile, des fils, une lampe, sans coupure.", ["pile", "fils", "lampe"]),
           "Le courant de la prise est très dangereux : on ne touche jamais une prise, surtout avec les mains mouillées."],
          [classer("Le courant passe-t-il ?", "Range chaque objet : le courant passe-t-il à travers ?", {
              "Conducteur (le courant passe)": ["un clou en fer", "une pièce", "du papier d'aluminium"], "Isolant (le courant ne passe pas)": ["une gomme", "du bois", "du plastique"]}),
           bulles("Sécurité", [
               ("Peut-on toucher une prise avec un objet en métal ?", ["Non, jamais", "Oui"]),
               ("Pour allumer une lampe avec une pile, le circuit doit être…", ["fermé", "ouvert", "coupé"])])],
          competence="Je comprends un circuit électrique simple", citation_exacte='Réaliser un circuit électrique à une boucle'),
    lecon("sc-ce1-etats-eau", S, "CE1", "Les états de l'eau", 30, C2.format("ce1", "etats-physiques-de-la-matiere"),
          ["eau", "glace", "vapeur", "état"],
          [("L'eau peut être solide (la glace), liquide (l'eau du robinet) ou gazeuse (la vapeur d'eau).", ["glace", "eau", "vapeur"]),
           "La glace fond quand il fait chaud. L'eau gèle quand il fait très froid, en dessous de zéro degré."],
          [ordre("De la glace à la vapeur", "Remets dans l'ordre, du plus froid au plus chaud.", ["un glaçon", "de l'eau froide", "de l'eau chaude", "de la vapeur"]),
           bulles("Solide, liquide ou gaz ?", [
               ("La neige est de l'eau…", ["solide", "liquide", "gazeuse"]),
               ("La buée sur la vitre vient de…", ["la vapeur d'eau", "la glace", "la pluie"]),
               ("À quelle température l'eau gèle-t-elle ?", ["0 degré", "50 degrés", "100 degrés"])])],
          competence="Je connais les états de l'eau", citation_exacte="Nommer le changement d'état (solidification et fusion)."),
    lecon("sc-ce1-sens", S, "CE1", "Les cinq sens", 40, C2.format("ce1", "sens-et-perception-chez-les-animaux"),
          ["perception", "sensoriel"],
          [("Nous avons cinq sens : la vue avec les yeux, l'ouïe avec les oreilles, l'odorat avec le nez, le goût avec la langue, le toucher avec la peau.", ["les yeux", "les oreilles", "le nez", "la langue", "la peau"])],
          [bulles("Quel sens ?", [
              ("Pour sentir une fleur, j'utilise…", ["l'odorat", "l'ouïe", "le goût"]),
              ("Pour entendre la musique, j'utilise…", ["l'ouïe", "la vue", "le toucher"]),
              ("Pour savoir si c'est sucré, j'utilise…", ["le goût", "l'odorat", "la vue"]),
              ("La chauve-souris se repère surtout grâce à…", ["l'ouïe", "la vue", "le goût"]),
              ("Le chien a un très bon…", ["odorat", "goût", "toucher"])])],
          competence="Je connais les cinq sens"),
    lecon("sc-ce1-dents", S, "CE1", "Prendre soin de ses dents", 50, C2.format("ce1", "sante-et-hygiene-de-vie"),
          ["dents", "hygiène"],
          [("On se brosse les dents matin et soir, pendant deux minutes.", ["matin", "soir"]),
           "Le sucre abîme les dents : il peut faire des caries."],
          [ordre("Bien se brosser les dents", "Remets les étapes dans l'ordre.", ["Mettre du dentifrice sur la brosse", "Brosser les dents du haut et du bas", "Brosser pendant deux minutes", "Cracher et rincer la bouche", "Rincer la brosse"]),
           bulles("Les dents", [
               ("Combien de fois par jour se brosser les dents ?", ["2 fois", "1 fois par semaine", "jamais"]),
               ("Qu'est-ce qui abîme les dents ?", ["le sucre", "l'eau", "les légumes"])])],
          competence="Je sais prendre soin de mes dents", citation_exacte="Identifier quelques règles d'hygiène de vie au quotidien"),

    # ---------------- CE2 ----------------
    lecon("sc-ce2-graine-plante", S, "CE2", "De la graine à la plante", 10, C2.format("ce2", "reproduction-croissance-et-developpement"),
          ["graine", "germination", "développement"],
          [("Une graine plantée dans la terre, avec de l'eau, germe : une petite racine et une petite tige sortent.", ["graine", "germination", "plantule"]),
           "La plante grandit, fait des fleurs, puis des fruits qui contiennent de nouvelles graines."],
          [ordre("La vie d'une plante", "Remets les étapes dans l'ordre.", ["La graine est plantée", "La graine germe", "La tige et les feuilles poussent", "La plante fleurit", "Le fruit apparaît avec des graines"]),
           bulles("Ce dont la plante a besoin", [
               ("Que faut-il à une graine pour germer ?", ["de l'eau", "du sucre", "du sel"]),
               ("Où sont les nouvelles graines ?", ["dans le fruit", "dans la racine", "dans la terre"])])],
          competence="Je connais le cycle de vie d'une plante", citation_exacte="Mesurer la croissance d’un être vivant (plante ou animal)"),
    lecon("sc-ce2-metamorphose", S, "CE2", "La métamorphose", 20, C2.format("ce2", "reproduction-croissance-et-developpement"),
          ["développement", "croissance"],
          [("Certains animaux changent complètement de forme en grandissant : c'est la métamorphose.", ["œuf", "têtard", "grenouille"]),
           "Le papillon commence sa vie en chenille, puis devient chrysalide, avant de devenir papillon."],
          [ordre("La vie de la grenouille", "Remets dans l'ordre.", ["l'œuf", "le têtard", "le têtard avec des pattes", "la grenouille"]),
           ordre("La vie du papillon", "Remets dans l'ordre.", ["l'œuf", "la chenille", "la chrysalide", "le papillon"])],
          competence="Je connais la métamorphose", citation_exacte='Distinguer chez les animaux les formes juvénile, larvaire et'),
    lecon("sc-ce2-locomotion", S, "CE2", "Comment se déplacent les animaux ?", 30, C2.format("ce2", "locomotion-chez-les-animaux"),
          ["déplacement", "locomotion"],
          [("Les animaux se déplacent de façons différentes : ils marchent, nagent, volent, rampent ou sautent.", ["marcher", "nager", "voler", "ramper", "sauter"])],
          [classer("Le déplacement des animaux", "Range chaque animal selon sa façon principale de se déplacer.", {
              "Il vole": ["l'aigle", "l'abeille"], "Il nage": ["le dauphin", "la truite"], "Il rampe": ["le serpent", "l'escargot"], "Il saute": ["le kangourou", "la grenouille"]})],
          competence="Je connais les modes de déplacement des animaux", citation_exacte="L'élève met en relation la forme de l'organe locomoteur"),
    lecon("sc-ce2-sommeil-sport", S, "CE2", "Sommeil et activité physique", 40, C2.format("ce2", "sante-et-hygiene-de-vie"),
          ["sommeil", "activité physique", "santé"],
          [("Un enfant a besoin de dormir environ 10 heures par nuit pour grandir et bien apprendre.", ["10 heures"]),
           "Bouger tous les jours, courir, jouer dehors, c'est bon pour le cœur et les muscles. Trop d'écrans fatigue les yeux et empêche de bien dormir."],
          [bulles("Prendre soin de son corps", [
              ("Combien d'heures un enfant doit-il dormir ?", ["environ 10 heures", "5 heures", "15 heures"]),
              ("Que faire avant de dormir ?", ["lire un livre", "jouer à un jeu vidéo", "manger des bonbons"]),
              ("Pourquoi faire du sport ?", ["pour le cœur et les muscles", "pour avoir faim", "pour rien"])])],
          competence="Je sais ce qui est bon pour ma santé", citation_exacte="identifie le bénéfice d'une activité physique régulière sur son bien-être."),

    # ---------------- CM1 ----------------
    lecon("sc-cm1-chaine-alimentaire", S, "CM1", "Les chaînes alimentaires", 10, C3.format("cm1", "les-ecosystemes"),
          ["écosystème", "chaîne alimentaire", "réseau"],
          [("Dans la nature, les êtres vivants se mangent les uns les autres : c'est une chaîne alimentaire.", ["herbe → lapin → renard"]),
           "Au début de chaque chaîne, il y a toujours une plante : elle fabrique sa matière grâce à la lumière du soleil."],
          [ordre("Une chaîne alimentaire", "Range du mangé au mangeur.", ["une feuille", "une chenille", "une mésange", "un épervier"]),
           ordre("Dans la mer", "Range du mangé au mangeur.", ["le plancton", "la sardine", "le thon", "le requin"]),
           bulles("Comprendre la chaîne", [
               ("Par quoi commence toujours une chaîne alimentaire ?", ["une plante", "un carnivore", "un champignon"]),
               ("S'il n'y a plus de lapins, que devient le renard ?", ["il a moins à manger", "il mange de l'herbe", "rien ne change"])])],
          competence="Je construis une chaîne alimentaire"),
    lecon("sc-cm1-melanges", S, "CM1", "Mélanges et solutions", 20, C3.format("cm1", "etats-et-constitution-de-la-matiere-a-l-echelle-macroscopique"),
          ["mélange", "dissolution", "solution"],
          [("Quand on met du sucre dans l'eau, il disparaît à nos yeux : il s'est dissous. C'est une solution.", ["sucre + eau"]),
           "Le sable, lui, ne se dissout pas : il tombe au fond. On peut le séparer en filtrant."],
          [classer("Se dissout-il dans l'eau ?", "Range chaque matière.", {
              "Se dissout": ["le sucre", "le sel", "le sirop"], "Ne se dissout pas": ["le sable", "l'huile", "les cailloux"]}),
           bulles("Séparer un mélange", [
               ("Pour séparer l'eau et le sable, je peux…", ["filtrer", "secouer", "chauffer le sable"]),
               ("L'huile dans l'eau…", ["reste au-dessus", "disparaît", "devient du sucre"])])],
          competence="Je connais les mélanges et la dissolution", citation_exacte="Séparer les constituants d'un mélange de solides"),
    lecon("sc-cm1-cerveau", S, "CM1", "Le cerveau", 30, C3.format("cm1", "le-cerveau-introduction-a-quelques-grandes-fonctions"),
          ["cerveau"],
          [("Le cerveau commande nos mouvements et reçoit les informations de nos sens, grâce aux nerfs.", ["cerveau", "nerfs", "muscles"]),
           "Pour bien fonctionner, il a besoin de sommeil, d'une bonne alimentation et d'apprendre souvent : à chaque révision, la mémoire se renforce."],
          [bulles("Le cerveau", [
              ("Qui commande nos mouvements ?", ["le cerveau", "l'estomac", "les poumons"]),
              ("Par où passent les messages entre le cerveau et le corps ?", ["les nerfs", "les os", "le sang"]),
              ("Qu'est-ce qui aide la mémoire ?", ["réviser souvent et bien dormir", "regarder la télé tard", "ne jamais réviser"]),
              ("Pour protéger son cerveau à vélo, on porte…", ["un casque", "des gants", "une écharpe"])])],
          competence="Je sais à quoi sert le cerveau"),
    lecon("sc-cm1-lumiere-son", S, "CM1", "La lumière et le son", 40, C3.format("cm1", "signaux"),
          ["lumière", "son", "signal"],
          [("La lumière va tout droit. Un objet opaque l'arrête et fait une ombre.", ["opaque", "ombre"]),
           "Le son est une vibration : quand on tape sur un tambour, la peau vibre et l'air transporte le son jusqu'à nos oreilles."],
          [classer("Transparent ou opaque ?", "Range chaque objet : laisse-t-il passer la lumière ?", {
              "Laisse passer la lumière": ["une vitre", "de l'eau claire", "un verre"], "Ne la laisse pas passer": ["un mur", "un livre", "une planche"]}),
           bulles("Lumière et son", [
               ("Pendant un orage, on voit l'éclair avant d'entendre le tonnerre car…", ["la lumière va plus vite que le son", "le son va plus vite", "l'éclair est plus près"]),
               ("Quand le soleil est bas, l'ombre est…", ["plus longue", "plus courte", "absente"])])],
          competence="Je connais quelques propriétés de la lumière et du son", citation_exacte="Observer et classer des matériaux selon qu'ils sont transparents, opaques ou translucides."),

    # ---------------- CM2 ----------------
    lecon("sc-cm2-volcans-seismes", S, "CM2", "Volcans et séismes", 10, C3.format("cm2", "la-terre-une-planete-active"),
          ["volcan", "séisme", "Terre"],
          [("Sous nos pieds, la Terre est très chaude. Parfois, de la roche fondue, le magma, remonte : c'est une éruption volcanique.", ["magma", "lave", "cratère"]),
           "Un séisme, ou tremblement de terre, se produit quand d'immenses plaques de roche bougent brusquement."],
          [bulles("La Terre active", [
              ("Comment s'appelle la roche fondue qui sort d'un volcan ?", ["la lave", "le sable", "la glace"]),
              ("Un tremblement de terre s'appelle aussi…", ["un séisme", "un ouragan", "une marée"]),
              ("Pendant un séisme, il faut…", ["s'abriter sous une table solide", "prendre l'ascenseur", "courir dans l'escalier"]),
              ("Le haut d'un volcan, d'où sort la lave, s'appelle…", ["le cratère", "la cave", "la source"])])],
          competence="Je comprends les volcans et les séismes", citation_exacte='identifie un risque naturel, ses conséquences sur les populations et les moyens de prévention et de protection associés.'),
    lecon("sc-cm2-alimentation", S, "CM2", "L'alimentation équilibrée", 20, C3.format("cm2", "alimentation-humaine"),
          ["alimentation", "aliments"],
          [("Les aliments apportent de l'énergie et de quoi construire notre corps. Il faut en manger de toutes les familles, en quantités adaptées.", ["énergie", "croissance"]),
           "On évite le grignotage et l'excès de sucre, de sel et de gras."],
          [classer("À quoi servent les aliments ?", "Range chaque aliment selon son rôle principal.", {
              "Donner de l'énergie (féculents)": ["les pâtes", "le pain", "le riz"], "Construire le corps (protéines)": ["les œufs", "le poisson", "les lentilles"],
              "Protéger (vitamines)": ["l'orange", "les épinards", "la tomate"]}),
           bulles("Les bons choix", [
               ("Que boire quand on a soif ?", ["de l'eau", "un soda", "un jus très sucré"]),
               ("Combien de fruits et légumes par jour ?", ["au moins 5", "1 par semaine", "aucun"])])],
          competence="Je sais composer un repas équilibré"),
    lecon("sc-cm2-energie-environnement", S, "CM2", "Protéger les écosystèmes", 30, C3.format("cm2", "les-ecosystemes"),
          ["écosystème", "humain", "environnement"],
          ["Les activités humaines peuvent abîmer les milieux de vie : pollution, déchets, destruction des forêts.",
           "On peut agir : trier ses déchets, économiser l'eau et l'énergie, protéger les haies et les zones humides."],
          [classer("Bon ou mauvais pour la planète ?", "Range chaque geste.", {
              "Bon geste": ["trier ses déchets", "éteindre la lumière en sortant", "aller à l'école à pied"],
              "Mauvais geste": ["laisser couler l'eau", "jeter un papier par terre", "laisser la télé allumée"]}),
           bulles("Le tri", [
               ("Une bouteille en plastique va dans…", ["la poubelle de tri", "la nature", "la poubelle des épluchures"]),
               ("Les épluchures de légumes peuvent aller…", ["au compost", "dans le recyclage du verre", "dans la rivière"])])],
          competence="Je connais des gestes pour protéger la planète"),
    lecon("sc-cm2-programmer-robot", S, "CM2", "Programmer un objet", 40, C3.format("cm2", "programmation-d-objets-techniques"),
          ["programm"],
          [("Un objet programmé suit des instructions : « si » il détecte un obstacle, « alors » il s'arrête.", ["si… alors…", "répéter"]),
           "Les capteurs servent à percevoir : lumière, son, distance. Les actionneurs agissent : moteur, lampe, haut-parleur."],
          [classer("Capteur ou actionneur ?", "Range chaque élément.", {
              "Capteur (il perçoit)": ["un détecteur de mouvement", "un thermomètre", "un microphone"], "Actionneur (il agit)": ["un moteur", "une lampe", "un haut-parleur"]}),
           ordre("Le programme de la veilleuse", "Remets le programme dans l'ordre.", ["Répéter toujours :", "Mesurer la lumière", "S'il fait noir, allumer la lampe", "Sinon, éteindre la lampe"])],
          competence="Je comprends comment on programme un objet"),
]
