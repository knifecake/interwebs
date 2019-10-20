---
title: "Defining infinite structures in Haskell"
layout: post
abstract: >
  This article is part of a series on Haskell about how easy it is to define
  infinite structures in really concise ways. Building on the previous article
  about lazy evaluation, we explore how to define infinite structures using
  recursion without using a base case. While in other languages this would
  result in an infinite loop, this does not happen in Haskell due to its
  powerful lazy evaluation strategy.
---

## First steps: an infinite list of ones

Recall from the [previous post]({{ page.previous.url }}) that in
Haskell, parameters are evaluated only when they are needed. Let us revisit a
simple example. Consider the following function definition.

{% highlight haskell %}
f :: Int -> Int -> Int
f a b = a * 2
{% endhighlight %}

Calling `f` with parameters `a = 2 + 3` and `b = 3 * 3` would result in the following execution:

{% highlight plain %}
  f a b
= f (2 + 3) (3 * 3)
= (2 + 3) * 2
= 5 * 2
= 10
{% endhighlight %}

Notice how the value of the parameter `b` is never computed. More importantly,
if the parameter `b` did not contain a simple arithmetic expression, but rather
some thing more complex, Haskell would not waste time computing its value.
Moreover, if the parameter `b` was `undefined`, i.e. if it could not be
computed, the function call `f a b` would not fail.

Now consider the following definition:

{% highlight haskell %}
ones :: [Int]
ones = 1 : ones
{% endhighlight %}

What do you think would happen if we called `ones`? Well, `ones` is defined
recursively, but it does not have a base case, so normally we would say that
execution does not terminate, or that a maximum depth of recursion is reached
and the program stops, or something along those lines. In Haskell, this is
still true, calling `ones` directly will result in the program never stopping.

But, what if we called `take 3 ones`. Remember that the function `take n xs`
returns the first `n` elements of the list `xs`. And indeed,

{% highlight haskell %}
ghci> take 3 ones
[1,1,1]
{% endhighlight %}

This not only doesn't fail, but returns the expected result. Let's look at the definition of take.

{% highlight haskell %}
take :: Int -> [a] -> [a]
take 0 _ = [] -- base case
take n (x : xs) = x : take (n - 1) xs -- recursive case
{% endhighlight %}

And let's look at how Haskell handles the call `take 3 ones`.

{% highlight haskell %}
  take 3 ones
= -- n = 3 dictates we go into the recursive case
  -- parameters are passed without being evaluated
take 3 (1 : ones)
= -- in the body of the recursive case,
  -- pattern matching assigns x = 1, xs = ones 
1 : take 2 ones
= -- n = 2 dictates we go into the recursive case
  -- the same pattern matching assignments are made
1 : 1 : take 1 ones
= -- n = 1 dictates we go into the recursive case
1 : 1 : 1 : take 0 ones
= -- n = 0 dictates we go into the base case
1 : 1 : 1 : take 0 ones
= -- this time, the body of the base case does not depend on xs
  -- so it is not evaluated and the function returns
1 : 1 : 1 : []
= -- syntactic sugar
[1,1,1]
{% endhighlight %}

Magic! As the expression `take 3 ones` did not depend on the full, infinite,
list of `ones`, only the relevant part was evaluated and Haskell was able to
correctly compute the expected result!

## More interesting infinite definitions

Base-case-less recursions need not be that simple. Assume we want to represent
**all of the natural numbers** in Haskell. We could easily do so with

{% highlight haskell %}
nats :: [Int]
nats = 0 : map (+1) nats
{% endhighlight %}

And indeed,

{% highlight plain %}
ghci> take 10 nats
[0,1,2,3,4,5,6,7,8,9]
{% endhighlight %}

(Exercise: try to expand the call stack for `take 2 nats` as we did before)

This is a common enough case that Haskell has special syntax[^1] for it:

{% highlight haskell %}
nats = [0..]

-- and we can even start later
[2..]
{% endhighlight %}

## The sieve of Erathostenes

Erathosthenes was a Greek mathematician who gave an algorithm to find all prime
numbers up to a limit. The algorithm is similar to trial division, only it is
constructive (i.e. instead of testing wether a number is prime, it finds all
prime numbers up to a limit). Lets look at the pseudocode

  1. List all numbers starting with `2` until `n`, where `n` is the upper bound in our search for primes.
  2. Take the first element `p` in the list and remove all multiples of $p$ from
    the list, i.e. remove `2p, 3p, 4p, ...` from the list. Another way to think
    of this is, remove a number `x` if `mod x p == 0`.
  3. Go back to the previous step starting with the first remaining number.

This algorithm may be used without an upper bound if one wishes to find **all**
of the prime numbers. In most languages this would not be possible but it is in
Haskell:

{% highlight haskell %}
-- List all numbers starting with 2, until infinity
primes :: [Int]
primes = sieve [2 .. ]

-- take the first number p in the list
sieve (p : xs) = p : ...

-- remove all multiples of p from the list
sieve (p : xs) = p : sieve [x | x <- xs, x `mod` p /= 0]

-- Done! (the definition above is recursive)
{% endhighlight %}

And indeed, 

{% highlight plain %}
ghci> take 4 primes
[2,3,5,7]
{% endhighlight %}

Lazy evaluation is a powerful evaluation strategy that allows us to concisely
and expressively write definitions of infinite structures. In future posts, we
will explore other consequences of this design decision of the Haskell language
and some situations in which it does not prove so useful.

[^1]: You might have seen the syntax `[a..b]` before. It is a shorthand for the function `enumFromTo` defined in [the enum class](https://www.haskell.org/onlinereport/haskell2010/haskellch6.html#x13-1310006.3.4). In fact, `[a..]` is also a shorthand for the method `enumFrom`. Integers in Haskell are an instance of the `Enum` class that defines these methods.
