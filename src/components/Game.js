import React, { useState, useEffect, useRef, useMemo } from 'react';
import '../styles/Game.css';
import words from 'an-array-of-english-words';

// Premium features
const POWER_UPS = {
  SLOW_MOTION: { name: 'Slow Motion', duration: 5000, cost: 100 },
  MAGNET: { name: 'Letter Magnet', duration: 8000, cost: 150 },
  HINT: { name: 'Word Hint', duration: 0, cost: 200 },
  SHIELD: { name: 'Shield', duration: 10000, cost: 300 }
};

const ACHIEVEMENTS = {
  FIRST_WORD: { name: 'First Steps', description: 'Complete your first word', points: 50 },
  SPEED_DEMON: { name: 'Speed Demon', description: 'Complete 5 words in under 30 seconds', points: 100 },
  PERFECT_GAME: { name: 'Perfect Game', description: 'Complete a game without losing a life', points: 200 },
  WORD_MASTER: { name: 'Word Master', description: 'Complete 50 words total', points: 500 }
};

// Word meanings dictionary
const WORD_MEANINGS = {
  'ABOUT': 'concerning; regarding',
  'ABOVE': 'at a higher level or layer than',
  'ABUSE': 'use (something) to bad effect or for a bad purpose',
  'ACTOR': 'a person whose profession is acting on stage, in movies, or on television',
  'ADMIT': 'confess to be true or to be the case',
  'ADULT': 'a person who is fully grown or developed',
  'AFTER': 'in the time following (an event or another period of time)',
  'AGAIN': 'another time; once more',
  'AGENT': 'a person who acts on behalf of another',
  'AGREE': 'have the same opinion about something',
  'AHEAD': 'further forward in space or time',
  'ALARM': 'an anxious awareness of danger',
  'ALBUM': 'a collection of recordings issued as a single item',
  'ALIEN': 'belonging to a foreign country or nation',
  'ALIKE': 'similar to each other',
  'ALIVE': 'living, not dead',
  'ALLOW': 'let (someone) have or do something',
  'ALONE': 'having no one else present',
  'ALONG': 'moving in a constant direction on (a road, path, or any more or less horizontal surface)',
  'ALTER': 'change or cause to change in character or composition',
  'AMONG': 'situated more or less centrally in relation to (several other things)',
  'ANGER': 'a strong feeling of annoyance, displeasure, or hostility',
  'ANGLE': 'the space (usually measured in degrees) between two intersecting lines or surfaces',
  'ANGRY': 'feeling or showing strong annoyance, displeasure, or hostility',
  'APART': 'separated by a distance in space or time',
  'APPLE': 'the round fruit of a tree of the rose family',
  'APPLY': 'make a formal application or request',
  'AREA': 'a region or part of a town, a country, or the world',
  'ARGUE': 'give reasons or cite evidence in support of an idea',
  'ARISE': 'originate from; be caused by',
  'ARMED': 'equipped with or carrying a weapon or weapons',
  'ARRAY': 'an impressive display or range of a particular type of thing',
  'ASIDE': 'to one side; out of the way',
  'ASSET': 'a useful or valuable thing, person, or quality',
  'AVOID': 'keep away from or stop oneself from doing (something)',
  'AWAKE': 'not asleep',
  'AWARD': 'a prize or other mark of recognition given in honor of an achievement',
  'AWARE': 'having knowledge or perception of a situation or fact',
  'BADLY': 'in an unsatisfactory, inadequate, or unsuccessful way',
  'BASIC': 'forming an essential foundation or starting point',
  'BEACH': 'a pebbly or sandy shore, especially by the ocean',
  'BEGAN': 'start; perform or undergo the first part of (an action or activity)',
  'BEING': 'existence',
  'BELOW': 'at a lower level or layer than',
  'BENCH': 'a long seat for several people, typically made of wood or stone',
  'BIBLE': 'the Christian scriptures',
  'BIRTH': 'the emergence of a baby or other young from the body of its mother',
  'BLACK': 'of the very darkest color owing to the absence of or complete absorption of light',
  'BLAME': 'assign responsibility for a fault or wrong',
  'BLANK': 'not marked or decorated',
  'BLIND': 'unable to see; sightless',
  'BLOCK': 'a large solid piece of hard material',
  'BLOOD': 'the red liquid that circulates in the arteries and veins',
  'BOARD': 'a long, thin, flat piece of wood or other hard material',
  'BOOST': 'help or encourage (something) to increase or improve',
  'BOOTH': 'a small temporary structure used for selling goods',
  'BOUND': 'walk or run with leaping strides',
  'BRAIN': 'an organ of soft nervous tissue contained in the skull',
  'BRAND': 'a type of product manufactured by a particular company',
  'BRASS': 'a yellow alloy of copper and zinc',
  'BRAVE': 'ready to face and endure danger or pain',
  'BREAD': 'food made of flour, water, and yeast mixed together and baked',
  'BREAK': 'separate or cause to separate into pieces as a result of a blow',
  'BREED': 'produce offspring',
  'BRIEF': 'of short duration; not lasting for long',
  'BRING': 'come to a place with (someone or something)',
  'BROAD': 'having an ample distance from side to side; wide',
  'BROKE': 'having completely run out of money',
  'BROWN': 'of a color produced by mixing red, yellow, and black',
  'BUILD': 'construct (something) by putting parts or material together',
  'BUILT': 'past tense of build',
  'BURST': 'break open or apart suddenly and violently',
  'BUSES': 'plural of bus',
  'CABLE': 'a thick rope of wire or hemp used for construction',
  'CACHE': 'a collection of items of the same type stored in a hidden or inaccessible place',
  'CARRY': 'support and move (someone or something) from one place to another',
  'CATCH': 'intercept and hold (something which has been thrown, propelled, or dropped)',
  'CAUSE': 'a person or thing that gives rise to an action, phenomenon, or condition',
  'CHAIN': 'a series of linked metal rings used for fastening or securing something',
  'CHAIR': 'a separate seat for one person, typically with a back and four legs',
  'CHAOS': 'complete disorder and confusion',
  'CHARM': 'the power or quality of giving delight or arousing admiration',
  'CHART': 'a sheet of information in the form of a table, graph, or diagram',
  'CHASE': 'pursue in order to catch or catch up with',
  'CHEAP': 'low in price, especially in relation to similar items or services',
  'CHECK': 'examine (something) in order to determine its accuracy',
  'CHEST': 'the front surface of a person\'s or animal\'s body between the neck and the abdomen',
  'CHIEF': 'a leader or ruler of a people or clan',
  'CHILD': 'a young human being below the age of puberty',
  'CHINA': 'a fine white or translucent vitrified ceramic material',
  'CHOSE': 'past tense of choose',
  'CIVIL': 'relating to ordinary citizens and their concerns',
  'CLAIM': 'state or assert that something is the case',
  'CLASS': 'a set or category of things having some property or attribute in common',
  'CLEAN': 'free from dirt, marks, or stains',
  'CLEAR': 'easy to perceive, understand, or interpret',
  'CLICK': 'make or cause to make a short, sharp sound',
  'CLIMB': 'go or come up (a slope, incline, or staircase)',
  'CLOCK': 'a mechanical or electrical device for measuring time',
  'CLOSE': 'a short distance away or apart in space or time',
  'CLOUD': 'a visible mass of condensed water vapor floating in the atmosphere',
  'COACH': 'a person who trains athletes or a team',
  'COAST': 'the part of the land near the sea',
  'COULD': 'past tense of can',
  'COUNT': 'determine the total number of (a collection of items)',
  'COURT': 'a body of people presided over by a judge',
  'COVER': 'put something on top of or in front of (something)',
  'CRAFT': 'an activity involving skill in making things by hand',
  'CRASH': 'a violent collision, typically of one vehicle with another',
  'CRAZY': 'mentally deranged, especially as manifested in a wild or aggressive way',
  'CREAM': 'the thick white or pale yellow fatty liquid which rises to the top when milk is left to stand',
  'CRIME': 'an action or omission which constitutes an offense',
  'CROSS': 'go across (an area)',
  'CROWD': 'a large number of people gathered together',
  'CROWN': 'a circular ornamental headdress worn by a monarch',
  'CRUDE': 'in a natural or raw state; not yet processed or refined',
  'CURVE': 'a line or outline which gradually deviates from being straight',
  'CYCLE': 'a series of events that are regularly repeated in the same order',
  'DAILY': 'done, produced, or occurring every day or every weekday',
  'DANCE': 'move rhythmically to music',
  'DATED': 'marked with a date',
  'DEALT': 'past tense of deal',
  'DEATH': 'the action or fact of dying or being killed',
  'DEBUT': 'a person\'s first appearance or performance in a particular capacity',
  'DELAY': 'make (someone or something) late or slow',
  'DEPTH': 'the distance from the top or surface to the bottom of something',
  'DOING': 'present participle of do',
  'DOUBT': 'a feeling of uncertainty or lack of conviction',
  'DOZEN': 'a group or set of twelve',
  'DRAFT': 'a preliminary version of a piece of writing',
  'DRAMA': 'a play for theater, radio, or television',
  'DRANK': 'past tense of drink',
  'DREAM': 'a series of thoughts, images, and sensations occurring in a person\'s mind during sleep',
  'DRESS': 'put on one\'s clothes',
  'DRILL': 'a tool or machine with a rotating cutting tip or reciprocating hammer',
  'DRINK': 'take (a liquid) into the mouth and swallow',
  'DRIVE': 'operate and control the direction and speed of a motor vehicle',
  'DROVE': 'past tense of drive',
  'DRUNK': 'affected by alcohol to the extent of losing control of one\'s faculties',
  'DRYER': 'a machine for drying something',
  'DUSTY': 'covered with or full of dust',
  'DYING': 'on the point of death',
  'EAGER': 'strongly wanting to do or have something',
  'EARLY': 'happening or done before the usual or expected time',
  'EARTH': 'the planet on which we live',
  'EIGHT': 'equivalent to the product of two and four',
  'ELITE': 'a select group that is superior in terms of ability or qualities',
  'EMPTY': 'containing nothing; not filled or occupied',
  'ENEMY': 'a person who is actively opposed or hostile to someone',
  'ENJOY': 'take delight or pleasure in (an activity or occasion)',
  'ENTER': 'come or go into (a place)',
  'ENTRY': 'an act of going or coming in',
  'EQUAL': 'being the same in quantity, size, degree, or value',
  'ERROR': 'a mistake',
  'EVENT': 'a thing that happens, especially one of importance',
  'EVERY': 'used to refer to all the individual members of a set without exception',
  'EXACT': 'not approximated in any way; precise',
  'EXIST': 'have objective reality or being',
  'EXTRA': 'added to an existing or usual amount or number',
  'FAITH': 'complete trust or confidence in someone or something',
  'FALSE': 'not according with truth or fact; incorrect',
  'FAULT': 'an unattractive or unsatisfactory feature',
  'FIBER': 'a thread or filament from which a vegetable tissue, mineral substance, or textile is formed',
  'FIELD': 'an area of open land, especially one planted with crops',
  'FIFTH': 'constituting number five in a sequence',
  'FIFTY': 'the number equivalent to the product of five and ten',
  'FIGHT': 'take part in a violent struggle involving the exchange of physical blows',
  'FINAL': 'coming at the end of a series',
  'FIRST': 'coming before all others in time or order',
  'FIXED': 'fastened securely in position',
  'FLASH': 'a sudden brief burst of bright light',
  'FLEET': 'a group of ships sailing together',
  'FLESH': 'the soft substance consisting of muscle and fat',
  'FLOAT': 'rest or move on or near the surface of a liquid',
  'FLOOD': 'an overflow of a large amount of water',
  'FLOOR': 'the lower surface of a room',
  'FLUID': 'a substance that has no fixed shape and yields easily to external pressure',
  'FOCUS': 'the center of interest or activity',
  'FORCE': 'strength or energy as an attribute of physical action or movement',
  'FORTH': 'out from a starting point and forward or into view',
  'FORTY': 'the number equivalent to the product of four and ten',
  'FORUM': 'a place, meeting, or medium where ideas and views on a particular issue can be exchanged',
  'FOUND': 'past tense of find',
  'FRAME': 'a rigid structure that surrounds or encloses something',
  'FRANK': 'open, honest, and direct in speech or writing',
  'FRAUD': 'wrongful or criminal deception intended to result in financial or personal gain',
  'FRESH': 'new or different from what was there before',
  'FRONT': 'the side or part of an object that is presented to view',
  'FRUIT': 'the sweet and fleshy product of a tree or other plant',
  'FULLY': 'completely or entirely',
  'FUNNY': 'causing laughter or amusement',
  'GIANT': 'of very great size or force',
  'GIVEN': 'past participle of give',
  'GLASS': 'a hard, brittle substance, typically transparent or translucent',
  'GLOBE': 'the earth',
  'GOING': 'present participle of go',
  'GRACE': 'smoothness and elegance of movement',
  'GRADE': 'a particular level of rank, quality, proficiency, or value',
  'GRAND': 'magnificent and imposing in appearance, size, or style',
  'GRANT': 'agree to give or allow (something requested)',
  'GRASS': 'vegetation consisting of typically short plants with long narrow leaves',
  'GRAVE': 'a place of burial for a dead body',
  'GREAT': 'of ability, quality, or eminence considerably above the normal',
  'GREEN': 'of the color between blue and yellow in the spectrum',
  'GROSS': 'very obvious and unacceptable',
  'GROUP': 'a number of people or things that are located, gathered, or classed together',
  'GROWN': 'past participle of grow',
  'GUARD': 'a person who keeps watch, especially a soldier or other person formally assigned to protect a person or place',
  'GUESS': 'estimate or suppose (something) without sufficient information to be sure of being correct',
  'GUEST': 'a person who is invited to visit someone\'s home or participate in a function',
  'GUIDE': 'a person who advises or shows the way to others',
  'HAPPY': 'feeling or showing pleasure or contentment',
  'HARRY': 'persistently carry out attacks on (an enemy or an enemy\'s territory)',
  'HEART': 'a hollow muscular organ that pumps the blood through the circulatory system',
  'HEAVY': 'of great weight; difficult to lift or move',
  'HORSE': 'a large plant-eating domesticated mammal with solid hoofs',
  'HOTEL': 'an establishment providing accommodations, meals, and other services for travelers',
  'HOUSE': 'a building for human habitation',
  'HUMAN': 'relating to or characteristic of humankind',
  'IDEAL': 'satisfying one\'s conception of what is perfect',
  'IMAGE': 'a representation of the external form of a person or thing',
  'INDEX': 'an alphabetical list of names, subjects, etc., with references to the places where they occur',
  'INNER': 'situated within or further in',
  'INPUT': 'what is put in, taken in, or operated on by any process or system',
  'ISSUE': 'an important topic or problem for debate or discussion',
  'JAPAN': 'a country in East Asia',
  'JIMMY': 'a short crowbar used by burglars',
  'JOINT': 'a point at which parts of an artificial structure are joined',
  'JONES': 'a surname',
  'JUDGE': 'a public official appointed to decide cases in a court of law',
  'KNOWN': 'recognized, familiar, or within the scope of knowledge',
  'LABEL': 'a small piece of paper, fabric, plastic, or similar material attached to an object',
  'LARGE': 'of considerable or relatively great size, extent, or capacity',
  'LASER': 'a device that generates an intense beam of coherent monochromatic light',
  'LATER': 'at some time in the future',
  'LAUGH': 'make the spontaneous sounds and movements of the face and body that are the instinctive expressions of lively amusement',
  'LAYER': 'a sheet, quantity, or thickness of material, typically one of several, covering a surface or body',
  'LEARN': 'gain or acquire knowledge of or skill in (something) by study, experience, or being taught',
  'LEASE': 'a contract by which one party conveys land, property, services, etc., to another for a specified time',
  'LEAST': 'smallest in amount, extent, or significance',
  'LEAVE': 'go away from',
  'LEGAL': 'relating to the law',
  'LEVEL': 'a horizontal plane or line with respect to the distance above or below a given point',
  'LIGHT': 'natural illumination from the sun',
  'LIMIT': 'a point or level beyond which something does not or may not extend or pass',
  'LINKS': 'plural of link',
  'LIVES': 'plural of life',
  'LOCAL': 'belonging or relating to a particular area or neighborhood',
  'LOOSE': 'not firmly or tightly fixed in place',
  'LOWER': 'situated below another part',
  'LUCKY': 'having, bringing, or resulting from good luck',
  'LUNCH': 'a meal eaten in the middle of the day',
  'LYING': 'present participle of lie',
  'MAGIC': 'the power of apparently influencing the course of events by using mysterious or supernatural forces',
  'MAJOR': 'important, serious, or significant',
  'MAKER': 'a person or thing that makes or produces something',
  'MARCH': 'walk in a military manner with a regular measured tread',
  'MATCH': 'a contest in which people or teams compete against each other',
  'MAYBE': 'perhaps; possibly',
  'MAYOR': 'the elected head of a city, town, or other municipality',
  'MEANT': 'past tense of mean',
  'MEDIA': 'the main means of mass communication',
  'METAL': 'a solid material that is typically hard, shiny, malleable, and ductile',
  'MIGHT': 'used to express possibility or make a suggestion',
  'MINOR': 'lesser in importance, seriousness, or significance',
  'MINUS': 'with the subtraction of',
  'MIXED': 'consisting of different qualities or elements',
  'MODEL': 'a three-dimensional representation of a person or thing',
  'MONEY': 'a current medium of exchange in the form of coins and banknotes',
  'MONTH': 'each of the twelve named periods into which a year is divided',
  'MORAL': 'concerned with the principles of right and wrong behavior',
  'MOTOR': 'a machine, especially one powered by electricity or internal combustion',
  'MOUNT': 'climb up (stairs, a hill, or other rising surface)',
  'MOUSE': 'a small rodent that typically has a pointed snout',
  'MOUTH': 'the opening in the lower part of the human face',
  'MOVED': 'past tense of move',
  'MOVIE': 'a story or event recorded by a camera as a set of moving images',
  'MUSIC': 'vocal or instrumental sounds combined in such a way as to produce beauty of form',
  'NEEDS': 'third person singular of need',
  'NEVER': 'at no time in the past or future',
  'NEWLY': 'recently; lately',
  'NIGHT': 'the period from sunset to sunrise in each twenty-four hours',
  'NOISE': 'a sound, especially one that is loud or unpleasant',
  'NORTH': 'the direction in which a compass needle normally points',
  'NOTED': 'well known; famous',
  'NOVEL': 'a fictitious prose narrative of book length',
  'NURSE': 'a person trained to care for the sick or infirm',
  'OCCUR': 'happen; take place',
  'OCEAN': 'a very large expanse of sea',
  'OFFER': 'present or proffer (something) for (someone) to accept or reject',
  'OFTEN': 'frequently; many times',
  'ORDER': 'the arrangement or disposition of people or things in relation to each other',
  'OTHER': 'used to refer to a person or thing that is different or distinct from one already mentioned',
  'OUGHT': 'used to indicate duty or correctness',
  'PAINT': 'a colored substance that is spread over a surface and dries to leave a thin decorative or protective coating',
  'PANEL': 'a flat or curved component, typically rectangular, that forms or is set into the surface of a door',
  'PAPER': 'material made in the form of sheets from wood pulp',
  'PARTY': 'a social gathering of invited guests',
  'PEACE': 'freedom from disturbance; tranquility',
  'PETER': 'a male given name',
  'PHASE': 'a distinct period or stage in a process of change or development',
  'PHONE': 'a device used to communicate with someone at a distance',
  'PHOTO': 'a photograph',
  'PIANO': 'a large keyboard musical instrument',
  'PIECE': 'a portion of an object or of material',
  'PILOT': 'a person who operates the flying controls of an aircraft',
  'PITCH': 'the quality of a sound governed by the rate of vibrations producing it',
  'PLACE': 'a particular position, point, or area in space',
  'PLAIN': 'not decorated or elaborate; simple or basic in character',
  'PLANE': 'a flat surface on which a straight line joining any two points on it would wholly lie',
  'PLANT': 'a living organism of the kind exemplified by trees, shrubs, herbs, grasses, ferns, and mosses',
  'PLATE': 'a flat dish, typically circular and made of china',
  'PLAZA': 'a public square or marketplace',
  'PLOT': 'a plan made in secret by a group of people to do something illegal or harmful',
  'PLUS': 'with the addition of',
  'POINT': 'the tapered, sharp end of a tool, weapon, or other object',
  'POUND': 'a unit of weight equal to 16 ounces',
  'POWER': 'the ability to do something or act in a particular way',
  'PRESS': 'move or cause to move into a position of contact with something',
  'PRICE': 'the amount of money expected, required, or given in payment for something',
  'PRIDE': 'a feeling of deep pleasure or satisfaction derived from one\'s own achievements',
  'PRIME': 'of first importance; main',
  'PRINT': 'produce (books, newspapers, etc.) by a mechanical process involving the transfer of text',
  'PRIOR': 'existing or coming before in time, order, or importance',
  'PRIZE': 'a thing given as a reward to the winner of a competition',
  'PROOF': 'evidence or argument establishing a fact or the truth of a statement',
  'PROUD': 'feeling deep pleasure or satisfaction as a result of one\'s own achievements',
  'PROVE': 'demonstrate the truth or existence of (something) by evidence or argument',
  'QUEEN': 'the female ruler of an independent state',
  'QUICK': 'moving fast or doing something in a short time',
  'QUIET': 'making little or no noise',
  'QUITE': 'to the utmost or most absolute extent or degree',
  'RADIO': 'the transmission and reception of electromagnetic waves of radio frequency',
  'RAISE': 'lift or move to a higher position or level',
  'RANGE': 'the area of variation between upper and lower limits on a particular scale',
  'RAPID': 'happening in a short time or at a great rate',
  'RATIO': 'the quantitative relation between two amounts showing the number of times one value contains or is contained within the other',
  'REACH': 'stretch out an arm in a specified direction in order to touch or grasp something',
  'READY': 'in a suitable state for an activity or situation',
  'REAL': 'actually existing as a thing or occurring in fact',
  'REBEL': 'a person who rises in opposition or armed resistance against an established government or ruler',
  'REFER': 'mention or allude to',
  'RELAX': 'make or become less tense or anxious',
  'REPLY': 'say something in response to something someone has said',
  'RIGHT': 'morally good, justified, or acceptable',
  'RIGID': 'unable to bend or be forced out of shape',
  'RIVER': 'a large natural stream of water flowing in a channel to the sea',
  'ROBOT': 'a machine capable of carrying out a complex series of actions automatically',
  'ROGER': 'a male given name',
  'ROMAN': 'relating to ancient Rome or its empire or people',
  'ROUGH': 'having an uneven or irregular surface',
  'ROUND': 'shaped like or approximately like a circle or cylinder',
  'ROUTE': 'a way or course taken in getting from a starting point to a destination',
  'ROYAL': 'belonging or relating to a monarch',
  'RURAL': 'in, relating to, or characteristic of the countryside rather than the town',
  'SCALE': 'a graduated range of values forming a standard system for measuring or grading something',
  'SCENE': 'the place where an incident in real life or fiction occurs',
  'SCOPE': 'the extent of the area or subject matter that something deals with',
  'SCORE': 'the number of points, goals, runs, etc., achieved in a game or by a team or an individual',
  'SENSE': 'a faculty by which the body perceives an external stimulus',
  'SERVE': 'perform duties or services for (another person or an organization)',
  'SETUP': 'the way in which something, especially an organization or equipment, is organized or arranged',
  'SEVEN': 'equivalent to the sum of three and four',
  'SHALL': 'expressing the future tense',
  'SHAPE': 'the external form, contours, or outline of someone or something',
  'SHARE': 'a part or portion of a larger amount which is divided among a number of people',
  'SHARP': 'having an edge or point that is able to cut or pierce something',
  'SHEET': 'a large rectangular piece of cotton or other fabric',
  'SHELF': 'a flat length of wood or rigid material, attached to a wall or forming part of a piece of furniture',
  'SHELL': 'the hard protective outer case of a mollusk or crustacean',
  'SHIFT': 'move or cause to move from one place to another',
  'SHINE': 'give out a bright light',
  'SHIRT': 'a garment for the upper body made of cotton or a similar fabric',
  'SHOCK': 'a sudden upsetting or surprising event or experience',
  'SHOOT': 'kill or wound (a person or animal) with a bullet or arrow',
  'SHORT': 'measuring a small distance from end to end',
  'SHOWN': 'past participle of show',
  'SIDED': 'having sides of a specified number or type',
  'SIGHT': 'the faculty or power of seeing',
  'SILLY': 'having or showing a lack of common sense or judgment',
  'SINCE': 'in the intervening period between (the time mentioned) and the time under consideration',
  'SIXTH': 'constituting number six in a sequence',
  'SIXTY': 'the number equivalent to the product of six and ten',
  'SIZED': 'having a specified size',
  'SKILL': 'the ability to do something well',
  'SLEEP': 'a condition of body and mind that typically recurs for several hours every night',
  'SLIDE': 'move along a smooth surface while maintaining continuous contact with it',
  'SMALL': 'of a size that is less than normal or usual',
  'SMART': 'having or showing a quick-witted intelligence',
  'SMILE': 'form one\'s features into a pleased, kind, or amused expression',
  'SMITH': 'a worker in metal',
  'SMOKE': 'a visible suspension of carbon or other particles in air',
  'SNAKE': 'a long limbless reptile',
  'SNOW': 'atmospheric water vapor frozen into ice crystals and falling in light white flakes',
  'SOLAR': 'relating to or determined by the sun',
  'SOLID': 'firm and stable in shape',
  'SOLVE': 'find an answer to, explanation for, or means of effectively dealing with (a problem or mystery)',
  'SORRY': 'feeling regret or penitence',
  'SOUND': 'vibrations that travel through the air or another medium',
  'SOUTH': 'the direction toward the point of the horizon 90° clockwise from east',
  'SPACE': 'a continuous area or expanse which is free, available, or unoccupied',
  'SPARE': 'additional to what is required for ordinary use',
  'SPEAK': 'say words in order to convey information, an opinion, or a feeling',
  'SPEED': 'the rate at which someone or something moves or operates',
  'SPEND': 'pay out (money) in buying or hiring goods or services',
  'SPENT': 'past tense of spend',
  'SPLIT': 'break or cause to break forcibly into parts',
  'SPOKE': 'past tense of speak',
  'SPORT': 'an activity involving physical exertion and skill',
  'STAFF': 'all the people employed by a particular organization',
  'STAGE': 'a point, period, or step in a process or development',
  'STAKE': 'a strong wooden or metal post with a point at one end',
  'STAND': 'have or maintain an upright position',
  'START': 'begin or be reckoned from a particular point in time or space',
  'STATE': 'the particular condition that someone or something is in at a specific time',
  'STEAM': 'the vapor into which water is converted when heated',
  'STEEL': 'a hard, strong, gray or bluish-gray alloy of iron with carbon',
  'STEEP': 'rising or falling sharply',
  'STEER': 'guide or control the movement of (a vehicle, vessel, or aircraft)',
  'STEPS': 'plural of step',
  'STICK': 'a thin piece of wood that has fallen or been cut off a tree',
  'STILL': 'not moving or making a sound',
  'STOCK': 'the goods or merchandise kept on the premises of a business',
  'STONE': 'hard solid nonmetallic mineral matter',
  'STOOD': 'past tense of stand',
  'STORE': 'a retail establishment selling items to the public',
  'STORM': 'a violent disturbance of the atmosphere with strong winds and usually rain',
  'STORY': 'an account of incidents or events',
  'STRIP': 'remove all coverings from',
  'STUCK': 'past tense of stick',
  'STUDY': 'the devotion of time and attention to acquiring knowledge',
  'STUFF': 'matter, material, articles, or activities of a specified or indeterminate kind',
  'STYLE': 'a particular procedure by which something is done',
  'SUGAR': 'a sweet crystalline substance obtained from various plants',
  'SUITE': 'a set of rooms in a hotel',
  'SUPER': 'very good or pleasant; excellent',
  'SWEET': 'having the pleasant taste characteristic of sugar or honey',
  'TABLE': 'a piece of furniture with a flat top and one or more legs',
  'TAKEN': 'past participle of take',
  'TALKS': 'third person singular of talk',
  'TANGO': 'a ballroom dance originating in Buenos Aires',
  'TASKS': 'plural of task',
  'TASTE': 'the sensation of flavor perceived in the mouth and throat on contact with a substance',
  'TAXES': 'plural of tax',
  'TEACH': 'impart knowledge to or instruct (someone) as to how to do something',
  'TEAMS': 'plural of team',
  'TEETH': 'plural of tooth',
  'TELLS': 'third person singular of tell',
  'TERMS': 'plural of term',
  'TESTS': 'plural of test',
  'TEXAS': 'a state in the southern US',
  'THANK': 'express gratitude to (someone)',
  'THEIR': 'belonging to or associated with the people or things previously mentioned',
  'THEME': 'the subject of a talk, piece of writing, exhibition, etc.',
  'THERE': 'in, at, or to that place or position',
  'THESE': 'used to identify a specific person or thing close at hand',
  'THICK': 'with opposite sides or surfaces that are far apart',
  'THING': 'an object that one need not, cannot, or does not wish to give a specific name to',
  'THINK': 'have a particular opinion, belief, or idea about someone or something',
  'THIRD': 'constituting number three in a sequence',
  'THOSE': 'used to identify a specific person or thing observed or heard by the speaker',
  'THREE': 'equivalent to the sum of one and two',
  'THREW': 'past tense of throw',
  'THUMB': 'the short, thick first digit of the human hand',
  'TIGHT': 'fixed, fastened, or closed firmly',
  'TIMER': 'a device for measuring time',
  'TIMES': 'plural of time',
  'TIRED': 'in need of sleep or rest',
  'TITLE': 'the name of a book, composition, or other artistic work',
  'TODAY': 'on or in the course of this present day',
  'TOKEN': 'a thing serving as a visible or tangible representation of a fact, quality, feeling, etc.',
  'TOMMY': 'a male given name',
  'TOOLS': 'plural of tool',
  'TOPIC': 'a matter dealt with in a text, discourse, or conversation',
  'TOTAL': 'comprising the whole number or amount',
  'TOUCH': 'come into or be in contact with',
  'TOUGH': 'strong enough to withstand adverse conditions or rough handling',
  'TOWER': 'a tall, narrow building, either freestanding or forming part of a building',
  'TRACK': 'a rough path or road, typically one beaten by use rather than constructed',
  'TRADE': 'the action of buying and selling goods and services',
  'TRAIN': 'a series of connected railroad cars',
  'TREAT': 'behave toward or deal with in a certain way',
  'TREND': 'a general direction in which something is developing or changing',
  'TRIAL': 'a formal examination of evidence by a judge',
  'TRIBE': 'a social division in a traditional society',
  'TRICK': 'a cunning or skillful act or scheme intended to deceive or outwit someone',
  'TRIED': 'past tense of try',
  'TRIES': 'third person singular of try',
  'TRULY': 'in a truthful way',
  'TRUNK': 'the main woody stem of a tree',
  'TRUST': 'firm belief in the reliability, truth, or ability of someone or something',
  'TRUTH': 'the quality or state of being true',
  'TUNED': 'past tense of tune',
  'TURNS': 'third person singular of turn',
  'TWICE': 'two times',
  'TWIST': 'form into a bent, curled, or distorted shape',
  'TYPES': 'plural of type',
  'UNDER': 'extending or directly below',
  'UNDUE': 'unwarranted or inappropriate because excessive or disproportionate',
  'UNION': 'the action or fact of joining or being joined',
  'UNITY': 'the state of being united or joined as a whole',
  'UNTIL': 'up to (the point in time or the event mentioned)',
  'UPPER': 'situated above another part',
  'UPSET': 'make (someone) unhappy, disappointed, or worried',
  'URBAN': 'in, relating to, or characteristic of a city or town',
  'USAGE': 'the action of using something',
  'USERS': 'plural of user',
  'USING': 'present participle of use',
  'USUAL': 'habitually or typically occurring or done',
  'VALID': 'having a sound basis in logic or fact',
  'VALUE': 'the regard that something is held to deserve',
  'VIDEO': 'the recording, reproducing, or broadcasting of moving visual images',
  'VIRUS': 'an infective agent that typically consists of a nucleic acid molecule',
  'VISIT': 'go to see and spend time with (someone) socially',
  'VITAL': 'absolutely necessary or important',
  'VOCAL': 'relating to the human voice',
  'WASTE': 'use or expend carelessly, extravagantly, or to no purpose',
  'WATCH': 'look at or observe attentively',
  'WATER': 'a colorless, transparent, odorless liquid',
  'WAVES': 'plural of wave',
  'WAYS': 'plural of way',
  'WEIRD': 'suggesting something supernatural; unearthly',
  'WELSH': 'relating to Wales or its people or language',
  'WHEEL': 'a circular object that revolves on an axle',
  'WHERE': 'in or to what place or position',
  'WHICH': 'asking for information specifying one or more people or things from a definite set',
  'WHILE': 'a period of time',
  'WHITE': 'of the color of milk or fresh snow',
  'WHOLE': 'all of; entire',
  'WHOSE': 'belonging to or associated with which person',
  'WOMAN': 'an adult human female',
  'WOMEN': 'plural of woman',
  'WORLD': 'the earth, together with all of its countries and peoples',
  'WORRY': 'feel or cause to feel anxious or troubled about actual or potential problems',
  'WORSE': 'of poorer quality or lower standard',
  'WORST': 'of the poorest quality or the lowest standard',
  'WORTH': 'equivalent in value to the sum or item specified',
  'WOULD': 'past of will',
  'WRITE': 'mark (letters, words, or other symbols) on a surface',
  'WRONG': 'not correct or true',
  'WROTE': 'past tense of write',
  'YARDS': 'plural of yard',
  'YEARS': 'plural of year',
  'YOUNG': 'having lived or existed for only a short time',
  'YOURS': 'belonging to or associated with the person or people that the speaker is addressing',
  'YOUTH': 'the period between childhood and adult age'
};

// Filter words that are suitable for the game (4-6 letters, no special characters)
const getRandomWords = (count = 15) => {
  const filteredWords = words.filter(word => {
    return word.length >= 4 && 
           word.length <= 6 && 
           /^[A-Za-z]+$/.test(word) &&
           !word.includes("'") &&
           !word.includes("-");
  });

  const randomWords = new Set();
  while (randomWords.size < count) {
    const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
    randomWords.add(randomWord.toUpperCase());
  }
  
  const selectedWords = Array.from(randomWords);
  console.log('Random Words Generated:', selectedWords);
  return selectedWords;
};

const Game = () => {
  // Generate random words only once when component mounts
  const gameWords = useMemo(() => {
    const words = getRandomWords(15);
    console.log('� Game Words:', words);
    console.log('🎯 First Word:', words[0]);
    return words;
  }, []);
  
  // Core game state
  const [score, setScore] = useState(0);
  const [targetWord, setTargetWord] = useState(gameWords[0]);
  const [collectedLetters, setCollectedLetters] = useState([]);
  const [sliderPosition, setSliderPosition] = useState(300);
  const [lives, setLives] = useState(3);
  const [discoveredWords, setDiscoveredWords] = useState([]);
  const [hiddenWords, setHiddenWords] = useState(gameWords);
  const [revealedIndices, setRevealedIndices] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  
  // Premium features state
  const [coins, setCoins] = useState(500); // Starting coins
  const [activePowerUps, setActivePowerUps] = useState({});
  const [achievements, setAchievements] = useState([]);
  const [theme, setTheme] = useState('default');
  const [difficulty, setDifficulty] = useState('normal');
  const [showParticles, setShowParticles] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [totalWordsCompleted, setTotalWordsCompleted] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showWordMeaning, setShowWordMeaning] = useState(true);
  
  // Refs
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const frameCountRef = useRef(0);
  const lettersRef = useRef([]);
  const particlesRef = useRef([]);
  const sliderSpeed = 10; // Pixels to move per keypress

  // Premium utility functions
  const addParticle = (x, y, type = 'letter') => {
    if (!showParticles) return;
    particlesRef.current.push({
      x, y, type,
      vx: (Math.random() - 0.5) * 4,
      vy: -Math.random() * 3 - 1,
      life: 60,
      maxLife: 60,
      color: type === 'letter' ? '#2196F3' : '#4CAF50'
    });
  };

  const playSound = (soundType) => {
    if (!soundEnabled) return;
    // Simple sound simulation - in a real app you'd use actual audio files
    console.log(`🔊 Playing sound: ${soundType}`);
  };

  const checkAchievements = () => {
    const newAchievements = [];
    
    if (discoveredWords.length === 1 && !achievements.includes('FIRST_WORD')) {
      newAchievements.push('FIRST_WORD');
    }
    
    if (discoveredWords.length >= 5 && !achievements.includes('SPEED_DEMON')) {
      const timeElapsed = (Date.now() - gameStartTime) / 1000;
      if (timeElapsed < 30) {
        newAchievements.push('SPEED_DEMON');
      }
    }
    
    if (lives === 3 && discoveredWords.length === gameWords.length && !achievements.includes('PERFECT_GAME')) {
      newAchievements.push('PERFECT_GAME');
    }
    
    if (totalWordsCompleted >= 50 && !achievements.includes('WORD_MASTER')) {
      newAchievements.push('WORD_MASTER');
    }
    
    if (newAchievements.length > 0) {
      setAchievements(prev => [...prev, ...newAchievements]);
      newAchievements.forEach(achievement => {
        const achievementData = ACHIEVEMENTS[achievement];
        setCoins(prev => prev + achievementData.points);
        playSound('achievement');
      });
    }
  };

  const activatePowerUp = (powerUpType) => {
    const powerUp = POWER_UPS[powerUpType];
    if (coins >= powerUp.cost) {
      setCoins(prev => prev - powerUp.cost);
      setActivePowerUps(prev => ({
        ...prev,
        [powerUpType]: Date.now() + powerUp.duration
      }));
      playSound('powerup');
      
      if (powerUpType === 'HINT') {
        // Reveal a random letter
        const unrevealedIndices = targetWord.split('').map((_, index) => index)
          .filter(index => !revealedIndices.includes(index));
        if (unrevealedIndices.length > 0) {
          const randomIndex = unrevealedIndices[Math.floor(Math.random() * unrevealedIndices.length)];
          setRevealedIndices(prev => [...prev, randomIndex]);
        }
      }
    }
  };

  const getDifficultyMultiplier = () => {
    switch (difficulty) {
      case 'easy': return 0.7;
      case 'normal': return 1.0;
      case 'hard': return 1.5;
      case 'expert': return 2.0;
      default: return 1.0;
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
    playSound('pause');
  };

  const getWordMeaning = (word) => {
    return WORD_MEANINGS[word] || 'Definition not available';
  };

  // Initialize falling letters
  useEffect(() => {
    // Initial letters will be created in the game loop
    return () => {
      lettersRef.current = []; // Clean up letters on unmount
      particlesRef.current = []; // Clean up particles on unmount
    };
  }, []);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });

    // Responsive canvas size
    const getCanvasSize = () => {
      const width = Math.min(window.innerWidth, 600);
      const height = Math.min(window.innerHeight * 0.6, 400);
      return { width, height };
    };

    const setCanvasSize = () => {
      const { width, height } = getCanvasSize();
      canvas.width = width;
      canvas.height = height;
    };

    setCanvasSize();

    // Enable image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let lastTime = 0;
    let frameDelay = 16;

    const addNewLetter = () => {
      const maxLetters = activePowerUps.SLOW_MOTION ? 3 : 5;
      if (lettersRef.current.length < maxLetters) {
        const { width } = getCanvasSize();
        const speedMultiplier = getDifficultyMultiplier();
        const isSlowMotion = activePowerUps.SLOW_MOTION && Date.now() < activePowerUps.SLOW_MOTION;
        
        lettersRef.current.push({
          char: letters[Math.floor(Math.random() * letters.length)],
          x: 0.08 * width + Math.random() * (width - 0.16 * width),
          y: -20,
          speed: (isSlowMotion ? 0.5 : 1.5) * speedMultiplier,
          id: Math.random(),
          isMagnetic: activePowerUps.MAGNET && Date.now() < activePowerUps.MAGNET
        });
      }
    };

    if (lettersRef.current.length === 0) {
      addNewLetter();
      addNewLetter();
    }

    const animate = (timestamp) => {
      setCanvasSize();
      const { width, height } = getCanvasSize();
      
      // Skip animation if game is paused
      if (isPaused) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (timestamp - lastTime < frameDelay) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      frameCountRef.current += 1;

      if (frameCountRef.current % 60 === 0) {
        addNewLetter();
      }

      ctx.fillStyle = '#f8f8f8';
      ctx.fillRect(0, 0, width, height);

      const updatedLetters = [];
      ctx.font = `bold ${Math.max(20, width/30)}px Arial`;

      for (const letter of lettersRef.current) {
        let newY = letter.y + letter.speed;
        let newX = letter.x;
        
        // Magnetic effect
        if (letter.isMagnetic) {
          const magnetStrength = 0.1;
          const dx = sliderPosition - letter.x;
          newX += dx * magnetStrength;
        }
        
        // Check for collection
        if (newY > height - 50 && newY < height - 30 && newX > sliderPosition - 50 && newX < sliderPosition + 50) {
          setCollectedLetters(prev => [...prev, letter.char]);
          addParticle(newX, newY, 'letter');
          playSound('collect');
          continue;
        }
        if (newY > height) continue;
        
        // Enhanced letter rendering with theme support
        const letterColor = theme === 'neon' ? '#00ff00' : theme === 'retro' ? '#ff6b35' : '#000';
        const bgColor = theme === 'neon' ? 'rgba(0, 255, 0, 0.2)' : theme === 'retro' ? 'rgba(255, 107, 53, 0.2)' : 'rgba(255, 255, 255, 0.9)';
        
        ctx.fillStyle = bgColor;
        ctx.fillRect(newX - 2, newY - 24, 30, 34);
        ctx.strokeStyle = letterColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(newX - 2, newY - 24, 30, 34);
        ctx.fillStyle = letterColor;
        ctx.fillText(letter.char, newX, newY);
        
        // Add glow effect for neon theme
        if (theme === 'neon') {
          ctx.shadowColor = '#00ff00';
          ctx.shadowBlur = 10;
          ctx.fillText(letter.char, newX, newY);
          ctx.shadowBlur = 0;
        }
        
        updatedLetters.push({ ...letter, y: newY, x: newX });
      }
      lettersRef.current = updatedLetters;

      // Update and render particles
      const updatedParticles = [];
      for (const particle of particlesRef.current) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        if (particle.life > 0) {
          const alpha = particle.life / particle.maxLife;
          ctx.globalAlpha = alpha;
          ctx.fillStyle = particle.color;
          ctx.fillRect(particle.x, particle.y, 4, 4);
          updatedParticles.push(particle);
        }
      }
      particlesRef.current = updatedParticles;
      ctx.globalAlpha = 1;

      // Enhanced slider with theme support
      const sliderWidth = Math.max(60, width * 0.16);
      const sliderHeight = Math.max(16, height * 0.05);
      const sliderY = height - 40;
      
      // Slider shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.fillRect(sliderPosition - sliderWidth/2 + 2, sliderY + 2, sliderWidth, sliderHeight);
      
      // Slider main body with theme colors
      const sliderColor = theme === 'neon' ? '#00ff00' : theme === 'retro' ? '#ff6b35' : '#2196F3';
      const sliderStrokeColor = theme === 'neon' ? '#00cc00' : theme === 'retro' ? '#e55a2b' : '#1976D2';
      
      ctx.fillStyle = sliderColor;
      ctx.fillRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight);
      ctx.strokeStyle = sliderStrokeColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight);
      
      // Slider highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(sliderPosition - sliderWidth/2, sliderY, sliderWidth, sliderHeight/2);
      
      // Power-up status indicators
      const powerUpY = 20;
      let powerUpX = 20;
      
      Object.entries(activePowerUps).forEach(([powerUpType, endTime]) => {
        if (Date.now() < endTime) {
          const remainingTime = Math.ceil((endTime - Date.now()) / 1000);
          const powerUp = POWER_UPS[powerUpType];
          
          // Power-up icon background
          ctx.fillStyle = '#4CAF50';
          ctx.fillRect(powerUpX, powerUpY, 30, 20);
          ctx.strokeStyle = '#45a049';
          ctx.lineWidth = 1;
          ctx.strokeRect(powerUpX, powerUpY, 30, 20);
          
          // Power-up text
          ctx.fillStyle = 'white';
          ctx.font = '10px Arial';
          ctx.fillText(powerUp.name.charAt(0), powerUpX + 5, powerUpY + 12);
          
          // Timer
          ctx.fillStyle = '#333';
          ctx.font = '8px Arial';
          ctx.fillText(remainingTime.toString(), powerUpX + 15, powerUpY + 8);
          
          powerUpX += 35;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    window.addEventListener('resize', setCanvasSize);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [sliderPosition]);

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      e.preventDefault(); // Prevent default arrow key scrolling
      
      switch (e.key) {
        case 'ArrowLeft':
          if (!isPaused) {
            setSliderPosition(prev => Math.max(50, prev - sliderSpeed));
          }
          break;
        case 'ArrowRight':
          if (!isPaused) {
            setSliderPosition(prev => Math.min(550, prev + sliderSpeed));
          }
          break;
        case ' ':
        case 'Space':
          e.preventDefault();
          togglePause();
          break;
      }
    };

    // Handle both keydown and keyup events
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPaused, sliderSpeed]);

  // Check for word completion and life reduction
  useEffect(() => {
    const word = collectedLetters.join('');
    
    // If any collected letter is not in the target word, reduce a life
    if (collectedLetters.length > 0 && collectedLetters.some(l => !targetWord.includes(l))) {
      console.log('❌ Incorrect letter found');
      setLives(prev => Math.max(0, prev - 1));
      setCollectedLetters([]);
      return;
    }

    // Reveal letter if it's in the target word
    collectedLetters.forEach(letter => {
      targetWord.split('').forEach((targetLetter, index) => {
        if (letter === targetLetter && !revealedIndices.includes(index)) {
          console.log('✨ Letter revealed:', letter);
          setRevealedIndices(prev => [...prev, index]);
          // Add points for each correct letter
          setScore(prev => prev + 10);
        }
      });
    });

    // Check if the word matches the target word
    if (word === targetWord) {
      // Calculate bonus and update score
      const wordBonus = 50 + (targetWord.length * 20);
      const difficultyBonus = Math.floor(wordBonus * (getDifficultyMultiplier() - 1));
      const totalBonus = wordBonus + difficultyBonus;
      
      setScore(prev => prev + totalBonus);
      setCoins(prev => prev + Math.floor(totalBonus / 10)); // Earn coins based on score
      setTotalWordsCompleted(prev => prev + 1);
      
      // Add celebration particles
      for (let i = 0; i < 10; i++) {
        addParticle(300, 200, 'word');
      }
      
      playSound('wordComplete');
      checkAchievements();
      
      // Move to next word immediately
      const nextIndex = currentWordIndex + 1;
      if (nextIndex < gameWords.length) {
        console.log('✨ Found:', targetWord);
        console.log('🎯 Next Word:', gameWords[nextIndex]);
        
        // Update states in sequence
        setDiscoveredWords(prev => [...prev, word]);
        setCurrentWordIndex(nextIndex);
        setTargetWord(gameWords[nextIndex]);
        setCollectedLetters([]);
        setRevealedIndices([]);
        setHiddenWords(prev => prev.filter(w => w !== word));
        
        // Show enhanced completion message
        const wordCompleteMessage = document.createElement('div');
        wordCompleteMessage.className = 'word-complete-message premium';
        wordCompleteMessage.innerHTML = `
          <div>✨ Word Found! ✨</div>
          <div>+${totalBonus} points</div>
          <div>+${Math.floor(totalBonus / 10)} coins</div>
        `;
        document.body.appendChild(wordCompleteMessage);
        setTimeout(() => wordCompleteMessage.remove(), 1200);
      } else {
        console.log('🎮 Game completed!');
        setLives(0);
      }
      
      // Move to next word after a short delay
      setTimeout(() => {
        const nextIndex = currentWordIndex + 1;
        if (nextIndex < gameWords.length) {
          console.log('🎯 Next Word to Find:', gameWords[nextIndex]);
          console.log('📊 Game Progress:', {
            wordNumber: nextIndex + 1,
            totalWords: gameWords.length,
            remainingWords: gameWords.length - nextIndex - 1
          });
          setCurrentWordIndex(nextIndex);
          setTargetWord(gameWords[nextIndex]);
        } else {
          console.log('Game completed! All words found!');
          // Game won - all words discovered
          setLives(0);
        }
      }, 1000);
    } else if (collectedLetters.length > targetWord.length) {
      // Reduce life if collected letters exceed target word length (unless shield is active)
      if (!(activePowerUps.SHIELD && Date.now() < activePowerUps.SHIELD)) {
      setLives(prev => Math.max(0, prev - 1));
        playSound('lifeLost');
      }
      setCollectedLetters([]);
    }
  }, [collectedLetters, targetWord, currentWordIndex, gameWords.length, revealedIndices]);


  // Handle mouse movement
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setSliderPosition(() => {
      // Responsive boundaries
      const min = canvas.width * 0.08;
      const max = canvas.width * 0.92;
      return Math.max(min, Math.min(max, x));
    });
  };

  // Handle touch movement for mobile
  const handleTouchMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - rect.left;
    setSliderPosition(() => {
      const min = canvas.width * 0.08;
      const max = canvas.width * 0.92;
      return Math.max(min, Math.min(max, x));
    });
  };

  return (
    <div className={`game-wrapper premium ${theme}`}>
      <div className="main-game-container">
        <div className="game-container">
          {/* Top Controls Bar */}
          <div className="top-controls-bar">
            <div className="game-info premium">
              <div className="stats-left">
                <p className="score">Score: {score.toLocaleString()}</p>
                <p className="coins">💰 {coins}</p>
                <p className="lives">❤️ {lives}</p>
              </div>
              <div className="stats-right">
                <p className="difficulty">Level: {difficulty.toUpperCase()}</p>
                <p className="words-completed">Words: {totalWordsCompleted}</p>
              </div>
            </div>
            
            <div className="top-controls">
              <button 
                className={`pause-resume-btn ${isPaused ? 'resume' : 'pause'}`}
                onClick={togglePause}
              >
                {isPaused ? '▶️ Resume' : '⏸️ Pause'}
              </button>
              
              <div className="quick-settings">
                <label className="quick-setting-item">
                  <input
                    type="checkbox"
                    checked={showWordMeaning}
                    onChange={(e) => setShowWordMeaning(e.target.checked)}
                  />
                  <span>Hints</span>
                </label>
                <label className="quick-setting-item">
                  <input
                    type="checkbox"
                    checked={showParticles}
                    onChange={(e) => setShowParticles(e.target.checked)}
                  />
                  <span>Effects</span>
                </label>
                <label className="quick-setting-item">
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <span>Sound</span>
                </label>
              </div>
            </div>
          </div>
          
          <p className="current-letters">{collectedLetters.join('')}</p>
        
          <div className="canvas-container">
            <canvas 
              ref={canvasRef} 
              className="game-canvas"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              style={{ cursor: 'none', touchAction: 'none' }}
            />
            {isPaused && (
              <div className="pause-overlay">
                <div className="pause-content">
                  <h2>⏸️ Game Paused</h2>
                  <p>Press SPACE or click the pause button to resume</p>
                  <button className="resume-btn" onClick={togglePause}>
                    ▶️ Resume Game
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Power-ups Section */}
          <div className="power-ups-section">
            <h4>Power-ups</h4>
            <div className="power-ups-grid">
              {Object.entries(POWER_UPS).map(([key, powerUp]) => (
                <button
                  key={key}
                  className={`power-up-btn ${coins >= powerUp.cost ? 'affordable' : 'expensive'}`}
                  onClick={() => activatePowerUp(key)}
                  disabled={coins < powerUp.cost}
                >
                  <div className="power-up-name">{powerUp.name}</div>
                  <div className="power-up-cost">💰 {powerUp.cost}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Advanced Settings */}
          <div className="advanced-settings">
            <div className="settings-row">
              <label className="setting-item">
                <span>Theme:</span>
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="default">Default</option>
                  <option value="neon">Neon</option>
                  <option value="retro">Retro</option>
                </select>
              </label>
              <label className="setting-item">
                <span>Difficulty:</span>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                  <option value="expert">Expert</option>
                </select>
              </label>
            </div>
          </div>
          
          <div className="game-controls">
            <p>Use ← → arrow keys or move mouse to control the slider</p>
            <p>Press SPACE or click pause button to pause/resume the game</p>
          </div>
        </div>
      
      <div className="words-sidebar premium">
        <h3>Progress: {discoveredWords.length}/{gameWords.length}</h3>
        
        <div className="current-word-container">
          <div className={`word-item ${discoveredWords.includes(targetWord) ? 'discovered' : 'hidden'}`}>
            <div className="word-content">
              {targetWord.split('').map((letter, index) => (
                <span key={index} className={revealedIndices.includes(index) ? 'revealed' : ''}>
                  {revealedIndices.includes(index) || discoveredWords.includes(targetWord) ? letter : '•'}
                </span>
              ))}
            </div>
            <div className="word-info">
              <span className="word-length">{targetWord.length} letters</span>
              <span className="word-hint">Current Word</span>
            </div>
            {showWordMeaning && (
              <div className="word-meaning">
                <div className="meaning-label">💡 Hint:</div>
                <div className="meaning-text">{getWordMeaning(targetWord)}</div>
              </div>
            )}
          </div>
        </div>
        
        {achievements.length > 0 && (
          <div className="achievements-section">
            <h4>Achievements</h4>
            <div className="achievements-list">
              {achievements.map((achievement, index) => (
                <div key={index} className="achievement-badge">
                  <div className="achievement-name">{ACHIEVEMENTS[achievement].name}</div>
                  <div className="achievement-desc">{ACHIEVEMENTS[achievement].description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!lives && (
          <div className="game-summary premium">
            <h3>Game Summary</h3>
            <p>Words Found: {discoveredWords.length}</p>
            <p>Total Score: {score.toLocaleString()}</p>
            <p>Coins Earned: {coins}</p>
            <p>Achievements: {achievements.length}</p>
          </div>
        )}
      </div>
      
      {lives === 0 && (
        <div className="game-over-popup premium">
          <div className="game-over-content">
            <h2>🎮 Game Over 🎮</h2>
            <div className="final-stats">
              <p>Final Score: {score.toLocaleString()}</p>
              <p>Words Completed: {discoveredWords.length}</p>
              <p>Coins: {coins}</p>
              <p>Achievements: {achievements.length}</p>
            </div>
            <button 
              className="restart-btn premium"
              onClick={() => {
                setScore(0);
                setLives(3);
                setCollectedLetters([]);
                setTargetWord(gameWords[0]);
                setCurrentWordIndex(0);
                setRevealedIndices([]);
                setDiscoveredWords([]);
                setGameStartTime(Date.now());
                setTotalWordsCompleted(0);
              }}
            >
              🔄 Restart Game
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Game;