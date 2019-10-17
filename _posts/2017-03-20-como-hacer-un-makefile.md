---
title: Como hacer un Makefile
layout: post
lang: es
abstract: >
  GNU make es una utilidad disponible en Linux que agiliza la tarea de compilar código desde la terminal. Nos evita tener que escribir los comandos de compilación a mano, que suelen ser muy largos, y en cambio nos permite escribir algo mucho más corto que al final hace lo mismo. Además, make puede hacer muchas otras cosas que harán que preparar las prácticas para enviarlas sea coser y cantar.
---

Los `Makefile`s son unos archivos que se incluyen en la carpeta raíz de un proyecto que le dicen a un programa, `make`, que se ejecuta desde la terminal, qué hacer con cada uno de los archivos de código para compilarlos. Para poder utilizar las "recetas de compilación" que escribimos en un `Makefile` es necesario tener instalado el programa `make`.

## ¿Qué necesito para utilizar `make`?

Make es un programa para Linux, por lo que necesitas tener acceso a una terminal de Linux. Hay varias opciones:

1. Instalar Linux en tu ordenador (es la que más quebraderos de cabeza te ahorrará).
2. Utilizar Linux desde tu sistema operativo como si fuera un programa más. Esto se llama virtualización y es bastante fácil de conseguir. Problemas: tendrás que configurar algunas cosas para poder compartir archivos entre tu ordenador y el Linux que tiene dentro, y además puede que Linux te vaya algo lento, ya que no puede disponer de todos los recursos de los que dispondría si estuviera solo.
3. Utilizar `cygwin`. Si estudias en la EPS de la UAM hay un tutorial en moodle sobre como instalártelo, si no, hay muchos en internet. Ahora bien, no acaba de funcionar nunca y no podrás tener `valgrind` que te ahorrará miles de quebraderos de cabeza cuando quieras encontrar problemas de memoria (`segmentation fault` and friends).

A la larga casi todo el mundo acaba cogiendo la primera porque es la que mejor funciona, pero si no tienes ganas o espacio en el disco, prueba la segunda. Asumiendo que has cogido la primera o la segunda, para instalar el programa `make`, que suele venir por defecto puedes hacer los siguiente si estás en Ubuntu o uno de sus primos (Debian, Xubuntu, etc.):

{% highlight bash %}
    sudo apt-get install make
{% endhighlight %}

Te pedirá tu contraseña para instalarlo. Ten en cuenta que por seguridad la contraseña no se muestra mientras la escribes (como en el navegador, que te muestra puntos, pero aquí no sale nada). Cuando hayas terminado de escribirla pulsa `Enter` y listo.

*OJO:* si eres nuevo en la terminal y estás un poco perdido, hay muchos tutoriales geniales en internet que te enseñarán lo básico.


## Cómo utilizar `make`

Vale, ya tienes `make` instalado. Ahora necesitas poder utilizarlo. Aunque no tengas `Makefile` todavía, el programa es suficientemente listo para compilar programas muy básico. Así por ejemplo si tienes el típico programa que imprime `hello world` en un fichero que has llamado `hello.c` puedes hacer lo siguiente para compilarlo (primero abre una terminal):

{% highlight bash %}
  cd carpeta_de_proyectos/carpeta_del_proyecto # aquí pon la ruta donde tienes guardado hello.c
  ls # imprime una lista de los archivos en dicha carpeta, asegúrate de que hello.c está aquí
  make hello # ojo, no make hello.c
{% endhighlight %}

Después de unos segundos y de que aparezca algo de texto, si no pone nada de error, tienes tu archivo `hello.c` compilado. Prueba a ejecutarlo escribiendo `./hello` en la terminal. Magia? No, en realidad es que `make` detecta que lo que quieres generar es un ejecutable llamado `hello` (de ahí lo de `make hello`) a partir de un archivo que intuye que se llama `hello.c` (es la convención).


## Cómo utilizar Makefiles para compilaciones más complicadas

Supongamos que tu archivo `main.c` incluye otros archivos como `stack.h`, ya que has implementado una pila y necesitas utilizarla en tu archivo principal. En esta ocasión, si simplemente haces `make main`, el programa `make` no será capaz de inferir que quieres enlazar tu `stack` con el `main` y probablemente la compilación falle. Aquí entran en juego los `Makefile`s, que albergan instrucciones de compilación para que no tengas que escribirlas cada vez que quieres compilar un archivo. Por ejemplo, supongamos que tienes un archivo objeto `stack.o` que ya has compilado, y quieres que `make` lo enlace con `main` cada vez que compiles `main.c`, un ejemplo de `Makefile` que haría esto sería el siguiente:

{% highlight make %}
main: main.c stack.o
	gcc -Wall -g -o main main.c stack.o
{% endhighlight %}

Veamos paso a paso lo que está ocurriendo:
1. En la primera linea tenemos el nombre del objetivo o target (`main` en este caso). Cuando ejecutamos `make algo`, el programa `make` buscará un objetivo llamado `algo`. Detrás de los dos puntos ponemos los nombres de los archivos que se utilizan para generar este target, en este caso el propio código fuente (`main.c`) y el objeto `stack.o` (no importa el orden). De esta manera le estamos diciendo a `make` que cada vez que le digamos que compile lo necesario para obtener el ejecutable `main`, se asgure de que existen `main.c` y `stack.o`. De hecho, si no existen ya, `make` buscará la manera de compilarlos (aquí está el poder de `make`). *Nota:* no tienen por qué coincidir el nombre del objetivo y el ejecutable que generamos con el compilador (lo que va detrás del `-o`, pero si no es así, `make` no será tan eficiente como puede ser).

2. Segunda línea. Lo primero es decir que debajo de la primera línea que define el objetivo, van todas las líneas que queramos con los comandos que se quieren ejecutar cuando escribamos `make objetivo` en la terminal. En este caso, cuando escribamos `make main` solo se ejecutará un comando, el del compilador, que ocupa toda la segunda línea. Una cosa muy importante es que las líneas que contienen instrucciones, como la segunda, *deben ir indentadas por un tabulador*, no por cuatro espacios o similar, de lo contrario `make` fallará.

Si este ejemplo existiera, al ejecutar `make main` en la terminal en realidad se estaría ejecutando `gcc -Wall -g -o main main.c stack.o`. Como puedes ver nos hemos ahorrado algunos caracteres que escribir y que memorizar.


## Utilizar `make` para manejar proyectos más grandes

Pero aquí pasa algo raro. Normalmente no tenemos un archivo `stack.o`, sino que tenemos `stack.c` y `stack.h` que luego generan un `stack.o`, que es el que finalmente enlazamos con `main`. Parece complicado pero `make` nos facilita mucho la tarea de ir compilando los archivos `.c` auxiliares y luego enlazarlos con el principal.

¿Recuerdas como al crear el `Makefile` especificábamos qué archivos eran necesarios para compilar un objetivo después de los dos puntos? Me refiero a `main.c stack.o`, lo que hemos puesto antes en la primera línea. En este caso `main.c` es un archivo que ya tenemos, pero `stack.o` necesita ser compilado a partir de `stack.c` y `stack.h`. Pues en vez de liar más la "receta" del objetivo `main` (la que hemos definido arriba), haremos una nueva para `stack.o`. De esta manera cuando `make` vea que necesita `stack.o` para compilar `main` y no lo tiene, recurrirá a esta nueva receta para generar `stack.o` y luego compilará `main`. Definamos la nueva receta a continuación de la anterior (el orden no importa).

{% highlight make %}
stack.o: stack.h stack.c
	gcc -Wall -g -c stack.o stack.c
{% endhighlight %}

Paso a paso:
1. En la primera línea definimos un nuevo objetivo, `stack.o`, que a su vez depende de los objetivos `stack.c` y `stack.h`. Como estos últimos son archivos que ya existen, no necesitamos definir "recetas" para ellos. Es más, `make` es suficientemente inteligente como para no compilar `stack.o` de nuevo, si no se han modificado cualquiera de sus dependencias (`stack.c` y `stack.h` en este caso).

2. Este es un comando de compilación parecido al anterior, pero que no genera un ejecutable, sino un archivo objeto. Este archivo `.o` servirá para enlazarlo al `main`, que de hecho es lo que hacemos al compilar `main.c` (fíjate como pasamos `.o` al final del comando de compilación del objetivo `main`).

Recapitulando, ahora al ejecutar `make main` en la linea de comandos, primero se ejecutarán las tareas del objetivo `stack.o`, porque `main` depende de él, y luego se ejecutarán las tareas del propio `main` para generar un ejecutable. El ahorro de tiempo se hace evidente ahora: compilar proyectos complicados se puede reducir a un simple `make archivo_principal` y listo.


## Tareas de `make` que no generan archivos

De momento `make` parece muy cómodo, pero poco a poco verás que se te llena la carpeta del proyecto con miles de archivos `.o` que realmente no sirven para mucho. Es más, cuando tengas que enviar tu proyecto a alguien tendrás que borrarlos, ya que los ejecutable solo valen para el sistema operativo que los genera, por lo que si estás el Linux no valdrán en MacOS o en otros sabores de Linux (con windows ya ni me meto). Puedes borrarlos a mano, o puedes decirle a `make` cómo borrarlos todos de golpe y ahorrar aún más tiempo:

{% highlight make %}
main: main.c stack.o
	gcc -g -Wall -o main main.c stack.o

stack.o: stack.c stack.h
	gcc -g -Wall -c stack.o stack.c

.PHONY: clean
clean:
	rm -rf *.o
{% endhighlight %}

Aquí hemos creado un objetivo, `clean`, que no tiene dependencias y que lo que hace es borrar cualquier archivo que acabe en `.o`. Hay un pequeño problema. Hemos dicho que los nombres de los objetivos se corresponden con el del archivo que generan pero `clean` no solo no genera, si no que borra archivos! Para que `make` no se líe añadimos `.PHONY: clean` encima de esta tarea. Nos queda el `Makefile` así:

{% highlight make %}
clean:
	rm -rf *.o
{% endhighlight %}

## Cómo utilizar variables para ganar aún más tiempo

Lo más probable es que siempre estés repitiendo `gcc -Wall -g` todo el rato. Lo que vamos a hacer es crear un par de variables para guardar eso y así no tener que escribirlo siempre. En su lugar le diremos a `make` que utilize lo que hay en las variables. Ahora puede no parecer de mucha utilidad pero hay veces en las que tienes unas 10 banderas, así que a la larga merece la pena. Normalmente definimos las variables al principio del `Makefile`:

{% highlight make %}
CC=gcc
CFLAGS=-Wall -g
{% endhighlight %}

y para utilizar las variables, es decir para que `make` ponga lo que hay guardado en la variable donde la queremos utilizar hacemos así:

{% highlight make %}
$(CC) $(CFLAGS) -o main main.c stack.o
{% endhighlight %}

de manera que el `Makefile` ahora es así:

{% highlight make %}
CC=gcc
CFLAGS=-Wall -g
main: main.c stack.o
	$(CC) $(CFLAGS) -o main main.c stack.o

stack.o: stack.c stack.h
	$(CC) $(CFLAGS )-c stack.o stack.c

.PHONY: clean
clean:
	rm -rf *.o
{% endhighlight %}

algo más corto sí que es.

## Nivel intermedio: utilizar más variables para escribir todavía menos.

Si te fijas, hay algo que seguimos repitiendo. Normalmente las dependencias de un target que se un ejecutable (lo que ponemos después de los dos puntos) coinciden con lo que vamos a utilizar en el enlazado, es decir con lo último que ponemos en el comando de compilación. Podemos crear variables que contengan las dependencias de cada uno de los ejecutables y utilizarlas para el enlazado (y por supuesto también para las dependencias). Haríamos algo así:

{% highlight make %}
OBJS_MAIN=stack.o
...
main: main.c $(OBJSMAIN)
	$(CC) $(CFLAGS) -o main.c $(OBJSMAIN)
{% endhighlight %}

aunque aquí puede parecer que el beneficio no es muy grande, si tuvieramos muchos objetos que enlazar, el `Makefile` si que sería significativamente más corto.


## Nivel avanzado: utilizar `make` para generar la distribución

Muchas veces tenemos que distribuir el código, o enviarlo, en forma de `zip`. En general, para todas aquellas veces que no vayamos a utilizar la misma estructura de carpetas para desarrollar un proyecto que para enviarlo (pienso en las prácticas de programación, por ejemplo), puede ser útil tener un target de `make` reordene los archivos por nosotros. Supongamos que tenemos que generar un `.zip` con los archivos fuente, con el propio `Makefile` y con una memoria explicativa. Podemos definir el siguiente target, que hace uso del comando `unzip` para generar un archivo comprimido:

{% highlight make %}
.PHONY: dist
dist: clean
	mkdir para_enviar # creamos una carpeta con lo que se va a enviar
	cp *.c *.h Makefile memoria.pdf para_enviar/ # copiamos los archivos necesarios
	zip entrega.zip para_enviar # comprimimos la carpeta
	rm -rf para_enviar # borramos la carpeta que habiamos creado, ahora ya tenemos el .zip
{% endhighlight %}

Una nota final: no hemos incluido la lista de todos los archivos fuente como dependencias del target `dist`. Esto hará que aunque no haya cambiado nada, si ejecutamos `make dist`, el archivo comprimido se volverá a generar igualmente. ¿Se te ocurre como modificar la tarea para que no ocurra esto innecesariamente? Es más, ¿qué variables utilizarías para evitar que la lista de dependencias fuera kilométrica?


## Ejemplo de Makefile

Uniendo todo lo anterior este sería un `Makefile` para una práctica de programación con 4 ejercicios que hace uso de varios objetos (`element_int`, `element_node`, `node`, `graph`, `stack_element` y `stack_fp`). Además incluye tareas para probar las librerías que hemos creado, tareas de distribución y tareas de limpieza.

<script src="https://gist.github.com/knifecake/421b85ab858c3e8df319fc63647a24b0.js"></script>
