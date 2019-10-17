---
title: "LabsEPS parte 1: el modelo"
layout: post
lang: es
abstract: >
  Muy de vez en cuando me encuentro vagando por los pasillos de la tercera
  planta de la escuela en busca de un laboratorio libre. Muchas veces, el
  laboratorio que está libre es el último que se me ocurre comprobar. Este es
  el primer post de una serie sobre el desarrollo de una aplicación que permite
  consultar qué laboratorios están libres.
---
*[SQL]: Structured Query Language
*[PHP]: PHP Hypertext Preprocessor
*[ORM]: Object Relational Mapping
*[API]: Application Programming Interface


*El desarrollo de esta aplicación tiene lugar en GitHub: [https://github.com/knifecake/labseps](https://github.com/knifecake/labseps)*

La escuela publica los horarios en su web. Además también hay horarios de cada
laboratorio en las puertas de estos y a veces funciona una pantalla que está en
la puerta de la tercera planta. La idea es conseguir estas tablas pero por
desgracia en la web solo están colgados los horarios por grupos y
cuatrimestres. Aún así, es posible que con un poco de *web scrapping* sea
posible obtener estas tablas. Es más, una vez tengamos los datos podremos
obtener respuestas a preguntas como ¿qué laboratorios hay libres mañana por la
mañana? o ¿qué laboratorios están libres el resto de la tarde? En esta serie
(que es posible que tenga una duración de una sola entrada) voy a hablar del
proceso de desarrollo de tal aplicación.

## Concretemos lo que queremos

El objetivo más básico es tener una aplicación que nos diga qué laboratorios
libres hay en este momento. Además también estaría bien que pudiera decir qué
laboratorios va a haber libres en las próximas horas o días. Nuestro punto de
partida son los datos disponibles en la página web de la Escuela. Una vez los
tengamos en un formato que podamos tratar solo tenemos que extraer la
información que necesitamos de ellos.

Para que la aplicación sea de utilidad tendrá que cumplir una serie de
requisitos. Lo más importante es que la información sea correcta y precisa. La
Escuela publica solamente los horarios de los tres grados que oferta pero en
los laboratorios ocurren muchas más cosas que las prácticas de los estudiantes
de grado: hay másteres, recuperaciones de clases y algún concurso. Además, es
posible que los datos que hay disponibles en la web no estén enteramente
actualizados o no sean completos. Por desgracia no podemos hacer mucho para
mitigar estos problemas ya que esta información solo la tiene la Escuela. Como
máximo podremos corregir o añadir información al conjunto de datos que
obtengamos. Esto es un proceso manual muy costoso pero teniendo en cuenta que
los horarios se actualizan una vez al año no es una tarea imposible.

A parte de esto la aplicación tiene que ser fácil de usar, tiene que responder
muy rápido y ser confiable &emdash; no como el Moodle, que se cae siempre antes
de un examen. Tiene que estar optimizada para móviles ya que la
gente la utilizará de camino a los laboratorios. Hoy en día hay cientos de
aplicaciones en cada móvil y los usuarios suelen mostrar reticencia a la hora
de instalar otra más. Además nuestra aplicación será muy ligera y se utilizará
durante periodos cortos de tiempo, no necesitará acceder a las APIs nativas de
los sistemas operativos móviles ni ocupará mucho espacio. Por estas razones me
parece que lo más lógico es diseñar una aplicación web. Si el tamaño es
suficientemente pequeño nadie se preocupará del tráfico consumido a la hora de
cargar la aplicación. Además, al no tener que instalarla será mucho más fácil
de compartir. Pero lo más importante es que no habrá que desarrollar una
aplicación para cada sistema operativo móvil ni habrá que esperar a que Apple
apruebe la aplicación o las actualizaciones para poder lanzarla en el App
Store. El coste de alojamiento se puede reducir a cero si la base de datos que
extraemos de la página web de la escuela es suficientemente pequeña. Basta con
incrustarla en la propia página web, implementar la lógica en JavaScript y
servir todos los archivos desde GitHub Pages.

Pero bueno, antes de pensar en cómo vamos a lanzar la aplicación, empecemos por
cómo vamos a obtener los datos y cómo los vamos a tratar una vez los hayamos
adquirido.

## Estructura de la aplicación

Hay dos partes claras en esta aplicación. Primero, un *web scrapper* que
navegará a la página de la Escuela e irá leyendo los datos de horarios. Por
otro lado tendremos un servidor web que accederá a estos datos y los presentará
a los usuarios de forma útil. El web scrapper se ejecutará poco (igual solo una
vez al año) mientras que el servidor web se ejecutará continuamente. Visto
esto, lo más fundamental es planificar de qué manera podrán compartir la
información estas dos partes, es decir, cual va a ser el modelo que
utilizaremos para los datos. Decidirse por un modelo al principio del
desarrollo es muy beneficioso porque permite que varios equipos puedan trabajar
en distintas partes de la aplicación y además ayuda a que los requisitos de la
aplicación sean cada vez más claros. En nuestro caso el modelo es simple: tiene
que reflejar los datos disponibles en la página de la Escuela y además tiene
que permitir el acceso a los mismos de manera suficientemente flexible para
poder contestar a las preguntas que planteábamos antes.


## El modelo

En la página de la Escuela, al pinchar sobre una clase en un horario aparece
otra ventana en la que se encuentran el lugar donde se celebrará la clase entre
otros datos. Como mínimo necesitamos quedarnos con un lugar, una hora de
comienzo y una hora de finalización por cada clase. Ya que vamos a invertir
bastante tiempo en desarrollar el web scrapper, aprovecharemos para quedarnos
con todos los atributos que podamos. Estos serán *nombre, abreviatura, código,
grupo, lugar, profesor, horas de inicio/finalización, día de la semana y
cuatrimestre*. Como tendremos muchas clases y todas con los mismos atributos
parece ser que un modelo relacional sería apropiado. Además el uso de bases de
datos relacionales nos permitirá utilizar SQL con lo que nos ahorraremos la
implementación de las búsquedas. Además, aunque las entidades centrales en los
horarios son las clases, en nuestra aplicación son los lugares así que parece
lógico separar la información sobre el lugar donde se celebran las clases de
los demás datos asociados a estas. Así, propongo el siguiente *modelo
relacional*, con una tabla para las clases:

Field name  | Field Type   | Source
----------- | ------------ | -------
short_name  | string       | Content of the `td` element in the main table
semester    | integer      | Content of the `h1` element in the main table
code        | string       | `onclick` handler first argument
starts_at   | string       | `onclick` handler second argument
ends_at     | string       | `onclick` handler third arguement
day_of_week | integer      | `onclick` handler fourth argument
course_name | string       | *Asignatura* in time slot detail
group       | string       | *Grupo* in time slot detail
professors  | string       | *Profesores* in time slot detail
room_id     | integer      | *Aula* in time slot detail

y otra para los lugares:

Field name  | Field Type   | Source
----------- | ------------ | -------
id          | integer      | Auto increment
name        | string       | *Aula* in time slot detail

Además, he añadido los tipos de datos de las distintas columnas de las tablas
de la base de datos. Aunque puedan parecer simplones, utilizar tipo string para
las horas y los días es nos da flexibilidad y además, como en las tablas que
publica la Escuela las horas están en formato 24h no necesitamos hacer nada
especial para la ordenación. Para los días de la semana y el cuatrimestre hemos
ido un poco más alla y decidimos codificarlos con números para evitar repetir
tantas veces la misma información. Aun así, la tasa de duplicidad es muy alta
en campos como profesores nombre o grupo. Este es el aspecto más reprochable de
este modelo pero elegimos hacerlo de esta manera porque evita tener que
implementar excesivas relaciones en el código (luego vemos cómo llevamos este
modelo a código) y porque el tamaño de los datos es pequeño (la base de datos
acaba ocupando solo 188kB).

La tercera columna indica cual va a ser la fuente canónica de cada atributo. En
ocasiones es posible obtener esta información de varios lugares por lo que
definimos cual va a ser la fuente canónica por si hubiera alguna incoherencia
en el futuro.

## Persistencia

El acceso a la base de datos será únicamente de lectura una vez se hayan
obtenido los datos. Los datos ya están disponibles online así que no pasa nada
si distribuimos el conjunto de datos completo a todos los usuarios en lugar de
ofrecer únicamente la posibilidad de hacer consultas. De hecho, esto puede ser
de utilidad para alguien que quiera mejorar la aplicación o acceder a los datos
para cualquier otro proposito. Es por esto que lo mejor es elegir una solución
abierta y ampliamente disponible. La mejor en este caso es probablemente
SQLite. SQLite se ejecuta en más ordenadores del mundo que Linux[^1] (son muchos),
es completamente abierto y además de guardar los datos permite hacer consultas
sobre ellos en SQL, con lo que nos ahorramos implementarlas nosotros a mano.
Además, se ejecuta de manera nativa en los navegadores con lo que podremos
distribuir la base de datos como un recurso de la aplicación web y así evitar
tener que configurar un servidor.[^2]

## Representación del modelo en código

A la hora de desarrollar tanto el web scrapper como el servidor web tendremos
que comunicarnos con la base de datos SQLite. Esto es sencillo ya que hay
librerías para casi todos los lenguajes de programación. Nosotros elegimos
Python básicamente porque me apetece pero no es una mejor elección que Ruby o
que Javascript por ejemplo. Al ser un lenguaje orientado a objetos, la opción
más natural es representar cada entidad del modelo con una clase. Además para
interactuar con la base de datos definiremos otra clase, una clase repositorio,
que implementará métodos para cada una de las acciones que necesitemos llevar a
cabo al hacer consultas. Esto es lo que se conoce como el patrón repositorio y
bien implementado nos puede dar una manera cómoda de utilizar la base de datos.

Admito que quizá es un poco innecesario montar todo este aparato ya que si
finalmente implementamos la lógica de las consultas en JavaScript para que lo
ejecute el navegador todo este código no nos valdrá. Aún así decido hacerlo por
las siguientes razones:

* En cualquier caso necesitamos escribir código para comunicarnos con la base de datos. Qué menos que esté organizado.
* Otra posibilidad hubiera sido utilizar una librería como SQLAlchemy o algún otro ORM pero me apetecía explorar este patrón de diseño (es más fácil de implementar que un ORM y a la larga acaba funcionando mejor, aunque no llegaremos a tales extremos en esta aplicación).
* El hecho de no utilizar una librería en este caso me ahorra tiempo ya que al no haber utilizado ninguna previamente en Python tendría que aprenderla (admito también que esta es una razón pobre).

Vistas estas consideraciones generales pasamos al plan de acción. La idea es
implementar dos clases base o abstractas: `Entity` y `EntityRepository`. La
primera se corresponde con la clase de la que heredaran todas las que
representen a entidades de nuestro modelo, a saber: `Lesson` y `Room`. La
segunda, `EntityRepository`, es la clase de la que heredarán todas las clases
que representen a los repositorios. En este caso habrá dos repositorios:
`LessonRepository` y `EntityRepository`.


<figure>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" contentScriptType="application/ecmascript" contentStyleType="text/css" height="303px" preserveAspectRatio="none" style="width:575px;height:303px;" version="1.1" viewBox="0 0 575 303" width="575px" zoomAndPan="magnify"><defs/><g><!--class Entity--><rect fill="#FFFFFF" height="99.2188" id="Entity" style="stroke: #000000; stroke-width: 1.5;" width="110" x="9" y="46.5"/><ellipse cx="40.2" cy="62.5" fill="#A9DCDF" rx="11" ry="11" style="stroke: #000000; stroke-width: 1.0;"/><path d="M40.3094,57.8438 L39.1531,62.9219 L41.4813,62.9219 L40.3094,57.8438 Z M38.825,55.6094 L41.8094,55.6094 L45.1688,68 L42.7156,68 L41.95,64.9375 L38.6688,64.9375 L37.9188,68 L35.4813,68 L38.825,55.6094 Z "/><text fill="#000000" font-family="Courier" font-size="12" font-style="italic" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="42" x="57.8" y="66.6543">Entity</text><line style="stroke: #000000; stroke-width: 1.5;" x1="10" x2="118" y1="78.5" y2="78.5"/><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="77" x="15" y="92.7104">-attributes</text><line style="stroke: #000000; stroke-width: 1.5;" x1="10" x2="118" y1="99.3047" y2="99.3047"/><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="98" x="15" y="113.5151">+__setattr__()</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="98" x="15" y="126.3198">+__getattr__()</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="70" x="15" y="139.1245">+__str__()</text><!--class EntityRepository--><rect fill="#FFFFFF" height="176.0469" id="EntityRepository" style="stroke: #000000; stroke-width: 1.5;" width="229" x="290.5" y="8"/><ellipse cx="344.75" cy="24" fill="#A9DCDF" rx="11" ry="11" style="stroke: #000000; stroke-width: 1.0;"/><path d="M344.8594,19.3438 L343.7031,24.4219 L346.0313,24.4219 L344.8594,19.3438 Z M343.375,17.1094 L346.3594,17.1094 L349.7188,29.5 L347.2656,29.5 L346.5,26.4375 L343.2188,26.4375 L342.4688,29.5 L340.0313,29.5 L343.375,17.1094 Z "/><text fill="#000000" font-family="Courier" font-size="12" font-style="italic" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="112" x="365.25" y="28.1543">EntityRepository</text><line style="stroke: #000000; stroke-width: 1.5;" x1="291.5" x2="518.5" y1="40" y2="40"/><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="77" x="296.5" y="54.2104">-table_name</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="84" x="296.5" y="67.0151">-primary_key</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="126" x="296.5" y="79.8198">-column_dictionary</text><line style="stroke: #000000; stroke-width: 1.5;" x1="291.5" x2="518.5" y1="86.4141" y2="86.4141"/><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="217" x="296.5" y="100.6245">+find(id: primary_key) : Entity</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="217" x="296.5" y="113.4292">+insert(e: Entity): primary_key</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="84" x="296.5" y="126.2339">+update(...)</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="84" x="296.5" y="139.0386">+delete(...)</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="105" x="296.5" y="151.8433">+create_table()</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="91" x="296.5" y="164.6479">+drop_table()</text><text fill="#000000" font-family="Courier" font-size="11" lengthAdjust="spacingAndGlyphs" textLength="119" x="296.5" y="177.4526">+entity_factory()</text><!--class Room--><rect fill="#FFFFFF" height="48" id="Room" style="stroke: #000000; stroke-width: 1.5;" width="60" x="6" y="244"/><ellipse cx="21" cy="260" fill="#ADD1B2" rx="11" ry="11" style="stroke: #000000; stroke-width: 1.0;"/><path d="M23.9688,265.6406 Q23.3906,265.9375 22.75,266.0859 Q22.1094,266.2344 21.4063,266.2344 Q18.9063,266.2344 17.5859,264.5859 Q16.2656,262.9375 16.2656,259.8125 Q16.2656,256.6875 17.5859,255.0313 Q18.9063,253.375 21.4063,253.375 Q22.1094,253.375 22.7578,253.5313 Q23.4063,253.6875 23.9688,253.9844 L23.9688,256.7031 Q23.3438,256.125 22.75,255.8516 Q22.1563,255.5781 21.5313,255.5781 Q20.1875,255.5781 19.5,256.6484 Q18.8125,257.7188 18.8125,259.8125 Q18.8125,261.9063 19.5,262.9766 Q20.1875,264.0469 21.5313,264.0469 Q22.1563,264.0469 22.75,263.7734 Q23.3438,263.5 23.9688,262.9219 L23.9688,265.6406 Z "/><text fill="#000000" font-family="Courier" font-size="12" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="28" x="35" y="264.1543">Room</text><line style="stroke: #000000; stroke-width: 1.5;" x1="7" x2="65" y1="276" y2="276"/><line style="stroke: #000000; stroke-width: 1.5;" x1="7" x2="65" y1="284" y2="284"/><!--class Lesson--><rect fill="#FFFFFF" height="48" id="Lesson" style="stroke: #000000; stroke-width: 1.5;" width="74" x="116" y="244"/><ellipse cx="131" cy="260" fill="#ADD1B2" rx="11" ry="11" style="stroke: #000000; stroke-width: 1.0;"/><path d="M133.9688,265.6406 Q133.3906,265.9375 132.75,266.0859 Q132.1094,266.2344 131.4063,266.2344 Q128.9063,266.2344 127.5859,264.5859 Q126.2656,262.9375 126.2656,259.8125 Q126.2656,256.6875 127.5859,255.0313 Q128.9063,253.375 131.4063,253.375 Q132.1094,253.375 132.7578,253.5313 Q133.4063,253.6875 133.9688,253.9844 L133.9688,256.7031 Q133.3438,256.125 132.75,255.8516 Q132.1563,255.5781 131.5313,255.5781 Q130.1875,255.5781 129.5,256.6484 Q128.8125,257.7188 128.8125,259.8125 Q128.8125,261.9063 129.5,262.9766 Q130.1875,264.0469 131.5313,264.0469 Q132.1563,264.0469 132.75,263.7734 Q133.3438,263.5 133.9688,262.9219 L133.9688,265.6406 Z "/><text fill="#000000" font-family="Courier" font-size="12" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="42" x="145" y="264.1543">Lesson</text><line style="stroke: #000000; stroke-width: 1.5;" x1="117" x2="189" y1="276" y2="276"/><line style="stroke: #000000; stroke-width: 1.5;" x1="117" x2="189" y1="284" y2="284"/><!--class LessonRepository--><rect fill="#FFFFFF" height="48" id="LessonRepository" style="stroke: #000000; stroke-width: 1.5;" width="144" x="240" y="244"/><ellipse cx="255" cy="260" fill="#ADD1B2" rx="11" ry="11" style="stroke: #000000; stroke-width: 1.0;"/><path d="M257.9688,265.6406 Q257.3906,265.9375 256.75,266.0859 Q256.1094,266.2344 255.4063,266.2344 Q252.9063,266.2344 251.5859,264.5859 Q250.2656,262.9375 250.2656,259.8125 Q250.2656,256.6875 251.5859,255.0313 Q252.9063,253.375 255.4063,253.375 Q256.1094,253.375 256.7578,253.5313 Q257.4063,253.6875 257.9688,253.9844 L257.9688,256.7031 Q257.3438,256.125 256.75,255.8516 Q256.1563,255.5781 255.5313,255.5781 Q254.1875,255.5781 253.5,256.6484 Q252.8125,257.7188 252.8125,259.8125 Q252.8125,261.9063 253.5,262.9766 Q254.1875,264.0469 255.5313,264.0469 Q256.1563,264.0469 256.75,263.7734 Q257.3438,263.5 257.9688,262.9219 L257.9688,265.6406 Z "/><text fill="#000000" font-family="Courier" font-size="12" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="112" x="269" y="264.1543">LessonRepository</text><line style="stroke: #000000; stroke-width: 1.5;" x1="241" x2="383" y1="276" y2="276"/><line style="stroke: #000000; stroke-width: 1.5;" x1="241" x2="383" y1="284" y2="284"/><!--class RoomRepository--><rect fill="#FFFFFF" height="48" id="RoomRepository" style="stroke: #000000; stroke-width: 1.5;" width="130" x="434" y="244"/><ellipse cx="449" cy="260" fill="#ADD1B2" rx="11" ry="11" style="stroke: #000000; stroke-width: 1.0;"/><path d="M451.9688,265.6406 Q451.3906,265.9375 450.75,266.0859 Q450.1094,266.2344 449.4063,266.2344 Q446.9063,266.2344 445.5859,264.5859 Q444.2656,262.9375 444.2656,259.8125 Q444.2656,256.6875 445.5859,255.0313 Q446.9063,253.375 449.4063,253.375 Q450.1094,253.375 450.7578,253.5313 Q451.4063,253.6875 451.9688,253.9844 L451.9688,256.7031 Q451.3438,256.125 450.75,255.8516 Q450.1563,255.5781 449.5313,255.5781 Q448.1875,255.5781 447.5,256.6484 Q446.8125,257.7188 446.8125,259.8125 Q446.8125,261.9063 447.5,262.9766 Q448.1875,264.0469 449.5313,264.0469 Q450.1563,264.0469 450.75,263.7734 Q451.3438,263.5 451.9688,262.9219 L451.9688,265.6406 Z "/><text fill="#000000" font-family="Courier" font-size="12" font-weight="bold" lengthAdjust="spacingAndGlyphs" textLength="98" x="463" y="264.1543">RoomRepository</text><line style="stroke: #000000; stroke-width: 1.5;" x1="435" x2="563" y1="276" y2="276"/><line style="stroke: #000000; stroke-width: 1.5;" x1="435" x2="563" y1="284" y2="284"/><!--link Entity to Room--><path d="M37.5,165.75 C37.5,165.75 37.5,243.6588 37.5,243.6588 " fill="none" id="Entity-Room" style="stroke: #000000; stroke-width: 1.0;"/><polygon fill="none" points="30.5001,165.75,37.5,145.75,44.5001,165.749,30.5001,165.75" style="stroke: #000000; stroke-width: 1.0;"/><!--link Entity to Lesson--><path d="M91,165.75 C91,165.75 91,268 91,268 C91,268 102.6562,268 115.861,268 " fill="none" id="Entity-Lesson" style="stroke: #000000; stroke-width: 1.0;"/><polygon fill="none" points="84.0001,165.75,91,145.75,98.0001,165.749,84.0001,165.75" style="stroke: #000000; stroke-width: 1.0;"/><!--link EntityRepository to LessonRepository--><path d="M337.25,204.0155 C337.25,204.0155 337.25,243.693 337.25,243.693 " fill="none" id="EntityRepository-LessonRepository" style="stroke: #000000; stroke-width: 1.0;"/><polygon fill="none" points="330.25,204.0155,337.25,184.015,344.25,204.0154,330.25,204.0155" style="stroke: #000000; stroke-width: 1.0;"/><!--link EntityRepository to RoomRepository--><path d="M476.75,204.0155 C476.75,204.0155 476.75,243.693 476.75,243.693 " fill="none" id="EntityRepository-RoomRepository" style="stroke: #000000; stroke-width: 1.0;"/><polygon fill="none" points="469.75,204.0155,476.75,184.015,483.75,204.0154,469.75,204.0155" style="stroke: #000000; stroke-width: 1.0;"/></g></svg>
</figure>

### Las clases de entidad

Los métodos disponibles en las clases de entidad son mínimos en este ejemplo ya
que en estas clases normalmente incorporaríamos los elementos de la lógica del
problema que estamos resolviendo como validación, atributos derivados y más. En
este caso nuestro problema es tan simple que las clases de entidad son meros
envoltorios de diccionarios o hashes. Aprovechamos que python nos permite
definir los métodos `__getitem__` y `__setitem__` para que podamos acceder a
los atributos de las entidades utilizando la notación propia de los
diccionarios. Es decir, que implementados estos métodos podremos acceder al
atributo `a` de la entidad `e` con la sintaxis `e['a']`. La implementación de
estos métodos consiste básicamente en crear aliases a los métodos propios del
diccionario de atributos que tendrá cada clase entidad. Así, la clase `Entity`
queda de la siguiente manera:

{% highlight python %}
class Entity:
    def __init__(self, attrs=None):
        if attrs is None:
            self.attrs = {}
        else: self.attrs = attrs

    def __getitem__(self, k):
        return self.attrs.get(k, None)

    def __setitem__(self, k, v):
        self.attrs[k] = v

    def __str__(self):
        return "<%s (%s): %s>" % (type(self).__name__, str(id(self)), str(self.attrs))
{% endhighlight %}

Hemos añadido también un método `__str__` que nos ha sido de ayuda al tener que
depurar.  Observemos que en la definición del constructor `__init__`
inicializamos el parámetro `attrs` a `None`. Esto es porque si lo
inicializáramos a un diccionario vacío con `def __init__(self, attrs={})`
entraría en juego un comportamiento algo raro de Python que consiste en que el
diccionario se inicializaría vacío solo la primera vez y en sucesivas llamadas
tendríamos referencias al mismo diccionario que se inicializó. Para más
detalles podemos consultar [este excelente
artículo](http://effbot.org/zone/default-values.htm). La definición de las
clases concretas `Lesson` y `Room` se reduce a marcar la herencia:

{% highlight python %}
class Lesson(Entity):
    pass

class Room(Entity):
    pass
{% endhighlight %}

### Las clases repositorio

Estas clases son realmente el centro del patrón repositorio. Abstraen la
conexión a la base de datos. Si el día de mañana cambiáramos el sistema de
gestión de bases de datos que utilizamos, solo sería necesario actualizar estas
clases para que la aplicación siguiera funcionando. Además, en este caso en
concreto, añadimos métodos para crear la base de datos porque nos resulta más
cómodo. En una aplicación más grande sería apropiado utilizar
[migraciones](https://laravel.com/docs/5.7/migrations#introduction) para esto.
No voy a entrar en detalles de implementación porque en muchos sitios se
explica cómo implementar el patrón repositorio pero sí merece la pena comentar
dos aspectos de la implementación que hacemos nosotros.

Para implementar la clase abstracta `EntityRepository` necesitamos dejar
algunos detalles de implementación a las clases hijas que heredarán de esta.
Estos son datos como el nombre de la tabla en la base de datos, las columnas
que tiene (la estructura o *schema*) y cuál es la clave primaria. En Python no
hay sintaxis para marcar una clase como abstracta pero conseguimos el mismo
resultado definiendo métodos para cada uno de estos datos (en otros lenguajes
podríamos dejarlos como atributos) pero sustituyendo el cuerpo de los mismo
por una sentencia que lanza la excepción `NotImplementedError`.

{% highlight python %}
class EntityRepository:
    @abstractmethod
    def table_name(self):
        """Returns the name of the table this repository mirrors."""
        raise NotImplementedError
{% endhighlight %}

Otro aspecto que necesitamos dejar por definir es las entidades concretas que
deben devolver los métodos de lectura del repositorio, esto es, qué tipo (o de
qué clase) deben ser los objetos que devuelva `find` dada una clave primaria.
La manera en la que hacemos esto es definiendo un *factory method* (ver
[Factory Method design
pattern](https://en.wikipedia.org/wiki/Factory_method_pattern)) en la clase
abstracta que debe retornar un objeto vacío del tipo de entidad con el que
tratamos.

{% highlight python %}
class EntityRepository:
    @abstractmethod
    def entity_factory(self, attrs):
        """Returns an entity objec. Optionally, it can be initailized with the given attributes."""
        raise NotImplementedError
{% endhighlight %}

Así, las clases hijas quedarían de la siguiente manera:

{% highlight python %}
class RoomRepository(EntityRepository):
    def __init__(self, connection_string):
        super(RoomRepository, self).__init__(connection_string)

    def table_name(self):
        return 'rooms'

    def column_dict(self):
        return {'id': 'INTEGER PRIMARY KEY', 'name': 'TEXT'}

    def primary_key(self):
        return 'id'

    def entity_factory(self, attrs):
        return Room(attrs)
{% endhighlight %}

El otro aspecto que merece la pena señalar está relacionado con la seguridad.
Aunque en nuestro caso la aplicación se ejecutará enteramente dentro del
navegador, no está mal tener en cuenta posibles ataques de *SQL injection*
sobre todo de cara a la parte de web scrapping. Un ataque de este tipo consiste
en manipular las partes de las consultas que dependen de entrada del usuario de
manera que cuando se ejecuten en el gestor de bases de datos tengan un efecto
no deseado. Por ejemplo, si quisiéramos buscar una persona por nombre
utilizaríamos la siguiente consulta: `SELECT * FROM people WHERE name='datos
proporcionados por el usuario';`. Un usuario malicioso podría darnos el nombre
`'; DROP TABLE people;--` y de esta manera conseguir que la consulta que
realmente se ejecutase fuera la siguiente: `SELECT * FROM people WHERE name='';
DROP TABLE people;--`. En realidad el usuario ha conseguido que se ejecuten dos
consultas. La primera no le ha servido para nada pero con la segunda ha
conseguido que perdamos los datos que teníamos. Este problema ya lleva décadas
resuelto en cualquier librería de bases de datos pero no es algo que debamos
dar por sentado. En nuestro caso debemos utilizar la sustitución de parámetros
que pone a nuestra disposición el paquete `sqlite3` de Python.

> Como anécdota, en el lenguaje de programación PHP se implementó una
> función encargada de sanear los parámetros proporcionados por el usuario
> llamada `mysql_escape_string`. Tristemente esta función no tenía el efecto
> desado y se implementó otra, `mysql_real_escape_string`, que [sí que saneaba
> apropiadamente los datos](https://stackoverflow.com/a/3665633/1646268). En
> más de un caso los desarrolladores no actualizaron su código y vimos [efectos
> catastróficos](https://en.wikipedia.org/wiki/SQL_injection#Examples).

## Conclusión (por ahora)

Tenemos ya una estructura base para poder comenzar a desarrollar el web
scrapper y además es suficientemente robusta para poder acomodar posibles
futuras extensiones. En la próxima entrada de la serie hablaré sobre cómo
enfocar el web scrapping de manera responsable y eficiente.

[^1]: Linux se ejecuta en innúmerables servidores y es la base de sistemas operativos como MacOS o Android pero SQLite está presente no solo en los ordenadores que llevan Linux sino que también lo está en Windows y en ocasiones estáticamente enlazado en algunas aplicaciones.

[^2]: Mi intención es hablar sobre el despliegue de la aplicación en una futura entrada. Si las entregas lo permiten.
