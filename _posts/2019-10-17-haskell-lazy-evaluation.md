---
title: "Lazy evaluation in Haskell"
layout: post
abstract: >
  This article is part of a series on Haskell about how easy it is to define
  infinite structures in really concise ways. Lazy evaluation is an evaluation
  strategy that is the foundation of many features of haskell, from performance
  to expressiveness. In this first article, we explore different evaluation
  strategies found in other languages, how they compare to Haskell's and their
  benefits and drawbacks.
---

# Evaluation strategies

## Call me by your value

When discussing different families of programming languages, we sometimes use
the phrases *call-by-value* to refer to how parameters are passed to a function
when it is called. Consider the following code in a generic language

{% highlight python %}
def f(a, b):
  return a * 2
{% endhighlight %}

If we say the language is *call-by-value* we mean that the variables `a` and
`b` are evaluated before copies of them are passed to the function `f`. For
instance, if we called `f` with arguments `a = 2 + 3` and `b = 3*3` the
following would happen in a *call-by-value* language:

{% highlight plain %}
  f(a, b)
= f((2 + 3), (3 * 3))
= f(5, (3 * 3))
= f(5, 9)
= 5 * 2
= 10
{% endhighlight %}

It takes roughly 5 steps to compute the value `f(a, b)`. Observe that even
though the value of `f` is only dependent on the value of `a`, the parameter
`b` is still evaluated. We call this evaluation strategy strict, because it
does not care about the utility of the values, it just computes everything as a
very stubborn robot would do. This is the case with some low-level languages
like `C`.[^1]

## Call me by your name

What if we delayed evaluation until the parameters were actually needed? We
call this *call-by-name* and it is a type of *non-strict* evaluation. Let's
look at how the previous computation would look like with a *call-by-name*
approach:

{% highlight plain %}
  f(a, b)
= f((2 + 3), (3 * 3))
= (2 + 3) * 2
= 5 * 2
= 10
{% endhighlight %}

Wow! We saved one step! This is not too good but suppose that `a` and `b`
weren't simple arithmetic expressions but complex computations instead. Then
not computing `b` would certainly be beneficial. Is this always the case? It
turns out, it isn't. Look at the following definition and compare the two
evaluations:

{% highlight plain %}
def square(a):
  return a * a

-- Call-by-value (strict) evaluation
  square(a)
= square((2 + 3))
= square(5)
= 5 * 5
= 25

-- Call-by-name (non-strict) evaluation
  square(a)
= square((2 + 3))
= (2 + 3) * (2 + 3)
= 5 * (2 + 3)
= 5 * 5
= 10
{% endhighlight %}

Yikes! That's one more step. Now a natural question is, which evaluation
strategy makes more sense? Call-by-name seems better since unused values are
not computed... Also, why did we calculate `(2 + 3)`, twice. Couldn't we have
stored the value for the second calculation.

## Call me lazy

Turns out if we add *sharing* to call-by-name, this strategy will never take
more steps to evaluate an expression than *call-by-value*. We call this
*call-by-need* or *lazy evaluation* in the context of Haskell. Call-by-need is
also a form of non-strict evaluation but has this added benefit of never
introducing a performance penalty (well, at least in the number of steps.[^2])

Let's look at how the previous examples would look like if we used call-by-need.

{% highlight plain %}
  f(a)
= f((2 + 3))
= (2 + 3) * 2
= 5 * 2
= 10

  square(a)
= square((2 + 3))
= (2 + 3) * (2 + 3)
= 5 * 5
= 10
{% endhighlight %}

We can see that in both cases the evaluation takes fewer steps than
call-by-name or call-by-value.

## Closing words

Call-by-need or lazy evaluation is central to both the performance and
expressiveness of the Haskell language. In addition, the Haskell compiler has
pureness and a strong type system at its disposal, enabling it to make much
more aggressive optimisations than in other languages, so that expressiveness
does not come with a performance price to pay.

In the following articles we will apply lazy evaluation to create infinite
structures.


### Some theoretical considerations

Maybe, you just became very worried. Will the incorporation of sharing yield
the same results as *call-by-value* or will we get different results for both
strategies. Well, you have nothing (well, almost nothing) to worry about. It
turns out that if functions are *pure*, i.e. they always return the same output
given the same inputs, the Church-Rosser theorem [^3] guarantees that both
computations will yield the same results. It is natural that functional
languages, such as Haskell, incorporate this evaluation strategy as they are
mostly pure. Impure parts such as IO, networking or randomness use a different
evaluation strategy so that no unexpected consequences arise.

If you want to read more about evaluation strategies, you can check out [this wikipedia article](https://en.wikipedia.org/wiki/Evaluation_strategy "Wikipedia article on evaluation strategies)


[^1]: Although in some languages we may substitute *call-by-name* with *call-by-reference*, the idea of strict evaluation still applies — **all parameters are evaluated before the function call** — only in call-by-reference the address of the value is passed instead of a copy of the value itself, allowing the function to modify it.

[^2]: It may, however, introduce a memory usage penalty, but these cases are more rare and easier to detect and fix just by rewriting the order of arguments.

[^3]: https://en.wikipedia.org/wiki/Church–Rosser_theorem
