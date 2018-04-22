---
title: "Cómo ser un hacker: una guía para ahorrar tiempo con las entregas"
layout: post
abstract: >
  Hacer entregas normalmente incluye una gran cantidad de trabajo repetitivo que se repite en varias asignaturas. Además, trabajar en grupo significa compartir código y luego juntarlo y hacer que funcione! Y si a esto le sumamos que desde la terminal podemos cargarnos nuestro sistema operativo, la verdad que no apetece nada ponerse a trabajar. Pero llega el día de la entrega y todo se acumula. Pues bien, es posible evitar estos tres problemas y ahorrar un montón de tiempo en el proceso.
---

*Este es un artículo largo y está aún en pañales. Lo voy actualizando según me permiten las entregas de la uni.*

## Prepara tu lugar de trabajo

* Separa tu entorno de edición de tu entorno de compilación.
* No permitas que un fallo en tu código se cargue tu sistema.

Pasarás más tiempo del que crees delante de una pantalla programando o
depurando, por lo que es importante configurar adecuadamente tu entorno de
trabajo. Lo ideal es que desde el principio utilices un sistema operativo
bueno, como puede ser Linux. Linux es en realidad un *kernel* sobre el que se basan varios sistemas operativos. Es decir, que Linux viene en varios [sabores](https://en.wikipedia.org/wiki/Linux_distribution "Wikipedia sobre las
distribuciones de Linux (en inglés)") (hay [unos
cuantos](https://upload.wikimedia.org/wikipedia/commons/1/1b/Linux_Distribution_Timeline.svg
"Imágen con un árbol genealógico de las principales versiones de Linux")). Cada
uno tiene sus puntos fuertes, pero casi todos son muy parecidos, por lo menos a
nivel de terminal. Yo recomiendo utilizar alguno basado en Debian y los
comandos que aparecen aquí están pensados para ello. Ubuntu es de la familia de
Debian.

Ahora bien, si algo le falla a Linux es que no está tan conseguido como otros
sistemas operativos comerciales (MacOS o Windows). Esto es porque está pensado
para ejecutarse principalmente en servidores y porque se construye a base del
esfuerzo de un gran equipo de voluntarios que son en su mayor parte buenos
programadores y malos diseñadores. Pero no pasa nada, porque la solución que
presentamos aquí te permitirá seguir utilizando la interfaz gráfica de tu
sistema operativo de elección. La única cosa que haremos será conseguir que la
terminal de Windows (o de MacOS) se comporte a todos los efectos como la
terminal de un ordenador Linux. Al hacerlo también obtendremos algunos
beneficios inesperados.

### Virtualización con Vagrant

Una buena solución para evitar romper nuestro ordenador mientras estamos
haciendo prácticas, o simplementa para poder desarrollar en un sistema
operativo inferior como Windows o MacOS, es utilizar
[virtualización](https://es.wikipedia.org/wiki/Virtualización "Artículo de
Wikipedia en castellano sobre virtualización").

Con una máquina virtual, podemos simular tener otro sistema operativo instalado
dentro del nuestro como si se tratara de una aplicación. Esto suele implicar
complicaciones a la hora de transferir archivos y a la hora de instalar drivers
gráficos. Además, puede llegar a consumir mucha memoria RAM y almacenamiento.

Estos problemas los evitamos con [Vagrant](https://www.vagrantup.com "Página
oficial de Vagrant en inglés"), un software pensado para la ejecución de
máquinas virtuales sin cabeza (o *headless* en inglés), es decir, que no tienen
interfaz gráfica. Una vez instalado Vagrant podrás disponer de una terminal de
tu sistema operativo de elección como si se tratara de la de tu sistema
operativo anfitrión. Además, no tendrás que preocuparte por la compartición de
archivos entre el <abbr title="Sistema Operativo">SO</abbr> anfitrión y el SO
huésped.

Bien, pues vamos diréctamente a ello. Para instalar Vagrant primero debes
instalar [VirtualBox](https://www.virtualbox.org/wiki/Downloads "Enlace a
descarga de VirtualBox"). Ten cuidado de descargar la versión correspondiente
al SO anfitrión, no al que luego querrás virtualizar (esto es, si tienes
Windows y quieres virtualizar Ubuntu, debes descargar VirtualBox para Windows).
A continuación descarga [Vagrant](https://www.vagrantup.com/downloads.html
"Página de descargas de Vagrant") también para tu sistema operativo anfitrión.
Una vez hecho esto ya no tienes que instalar nada más.

Vagrant no es un programa interactivo como VirtualBox o VMWare, sino que se
controla desde la terminal. Abre una terminal en tu ordenador y verifica que
Vagrant está correctamente instalado ejecutando `vagrant version`. Si todo va
bien, deberías ver algo así:

{% highlight bash %}
$ vagrant version
Installed Version: 2.0.4
Latest Version: 2.0.4

You're running an up-to-date version of Vagrant!
{% endhighlight %}

Ahora llega el momento de crear las máquinas virtuales. Cada máquina virtual
que quieras vendrá descrita por un archivo llamado Vagrantfile, que contiene
directivas que instruyen a Vagrant sobre como crear la máquina virtual. Los
detalles son poco importantes, lo interesante es que puedes obtener archivos ya
creados desde [Vagrant Cloud](https://app.vagrantup.com/boxes/search). Esta
página es un repositorio de archivos Vagrantfile: puedes consultar los que hay
disponibles. Cuando elijas uno, no hace falta que lo descargues, sino que desde
la terminal puedes instalarlo en tu equipo diréctamente. Supongamos que decides instalar la última versión de Ubuntu, es decir que elijes el archivo `ubuntu/bionic64`. Pues los comandos que necesitas ejecutar para instalarlos son los siguientes:

{% highlight bash %}
$ cd path/to/project
$ vagrant init ubuntu/bionic64
$ vagrant up
{% endhighlight %}

Con esos tres comandos creas una máquina virtual con Ubuntu. Fíjate en que
hemos ido al directorio de proyecto en el que estás trabajando para crear la
máquina virtual. Esto es porque Vagrant asume que vas a utilizar una máquina
virtual para cada proyecto y monta los archivos de la carpeta donde ejecutas
`vagrant up` en el sistema de archivos de la máquina virtual. Aunque pueda
parecer excesivo, esto no consume demasiados recursos, al no tener interfaz
gráfica.

Aquí van algunos comandos útiles para trabajar con Vagrant. Ten en cuenta que todos actuan sobre la máquina virtual ligada al Vagrantfile del directorio actual.
{% highlight bash %}
# crea un nuevo Vagrantfile con el SO especificado
$ vagrant init ubuntu/bionic64

# crea y arranca la máquina virtual a partir del Vagrantfile
$ vagrant up

# te conecta a la máquina virtual: tu terminal se convierte en una terminal del sistema operativo huésped
$ vagrant ssh

# suspende la máquina virtual para que no consuma RAM
$ vagrant suspend

# apaga la máquina virtual
$ vagrant halt

# destruye la máquina virtual
$ vagrant destroy
{% endhighlight %}

Por último, adjunto un Vagrantfile que yo utilizo muy a menudo para proyectos
en C. Tiene todas las herramientas de las que hablamos aquí ya instaladas. Si
decides utilizar este Vagrantfile, debes omitir el comando `vagrant init
ubuntu/bionic64` y sustituirlo por copiar este texto a un archivo llamado
Vagrantfile dentro de tu carpeta de proyecto.

{% highlight ruby %}
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"

  config.vm.provision "shell", inline: <<-SHELL
    apt-get update
    apt-get install -y doxygen valgrind texlive texlive-fonts-extra texlive-latex-extra texlive-lang-spanish pandoc
    wget -O /usr/share/pandoc/data/templates/eisvogel.latex https://raw.githubusercontent.com/Wandmalfarbe/pandoc-latex-template/master/eisvogel.tex
  SHELL
end
{% endhighlight %}



## Git (y GitHub) son tus amigos

* Commits, push, rebase?...
* Colaboración e integración con GitHub.

## Automatiza la compilación (y más) con GNUMake

* Makefiles para código
* Makefiles para todo en realidad: autoentregas

### Makefiles para todo lo demás: generando un archivo comprimido para la entrega
Supongamos que ya tienes todo el código listo y solo te queda hacer el `.zip` y enviar. Podríamos utilizar WinRAR or hacerlo desde el explorador de archivos pero, lo más probable, es que no hagas esto solo una vez. Podemos configurar make para que nos genera automáticamente el fichero `.zip` de la entrega y así ahorrar tiempo y evitar dejarnos algún archivo fuera. Podemos hacerlo añadiendo una tarea a nuestro `Makefile` con lo siguiente:

{% highlight make linenos %}
DIST_DIR=EntregaP02_pareja3

.PHONY: dist
dist:
	mkdir -p $(DIST_DIR)
	cp -r src/ memoria.pdf autores.txt $(DIST_DIR)/
	zip -r $(DIST_DIR).zip $(DIST_DIR)
	rm -r $(DIST_DIR)
{% endhighlight %}

El código de arriba crea una carpeta temporal, `EntregaP02_pareja3`, mueve los
archivos que queremos entregar dentro de esa carpeta, comprime la carpeta y por
último la borra (una vez tenemos el zip no necesitamos la carpeta temporal ya
que los archivos originales siguen donde estaban). La línea más importante es
la del comando `cp`. Los primeros argumentos indican los archivos o carpetas
que queremos entregar. Cualquier cosa que quieras que acabe dentro del archivo
comprimido que entregarás puedes añadirla despues de `cp -r`. El último
argumento es el directorio temporal donde se copiarán estos archivos para luego
generar el `.zip`.

## Abraza el poder de UNIX y la terminal

* Wildcards
* Pandoc, latex
* Documentación con doxygen
* Miniutilidades: wc, ls -lah,...
* man es tu amigo
