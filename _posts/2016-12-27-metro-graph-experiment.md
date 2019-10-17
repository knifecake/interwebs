---
layout: post
title: Probando el algoritmo de Dijkstra en el Metro de Madrid
lang: es
abstract: >
  La idea original era ver si era posible cargar un archivo que
  describe la red de metro de Madrid como una lista de estaciones por líneas pero
  representándola como un grafo. Luego pudimos implementar una versión
  simplificada del algoritmo de Dijkstra que encuentra el camino más corto (en
  número de estaciones) entre dos paradas elegidas.
---

Lo primero decir que queda mucho sitio para mejorar el programa. En primer
lugar, no aprovechamos el archivo al máximo. Esto es porque no utilizamos la
información de las correspondencias de las estaciones para crear el grafo. Esto
no supone un problema ya que al final el resultado es el mismo, solo que no
podemos diferenciar entre un salto de estación entre líneas (transbordo) y un
salto de estaciones dentro de la misma línea.

Por otra parte decir que habría que pulir el código en términos de interfaz de
usuario ya que, a pesar de que utilizamos la librería `cs50.h` que nos protege
bastante, todavía sigue fallando a veces si el usuario introduce `Ctrl-D`.

Bueno sin más dilación aquí va el código:

<script src="https://gist.github.com/knifecake/53758381bc4feb666516b3f0448dc301.js"></script>

