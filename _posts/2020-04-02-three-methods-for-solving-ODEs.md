---
title: "Three naive methods for solving systems of ordinary differential equations"
layout: "post"
abstract: >
  We present three naive iterative methods for solving systems of ordinary
  differential equations which are widely discussed in undergraduate level
  scientific computing courses. Implementations are given in MATLAB code.
---

There are several strategies for solving the systems of ODEs. Some systems,
such as the linear ones, can relatively easily be solved analytically. Others,
mandate that we use numerical methods. We shall first instroduce a method based
on an analytic result that will allow us to validate the other methods, at
least on the linear case. Then we move on to other methods which support
arbitrary systems of ODEs.

<p class="alert-warning">This is a work in progress post. This means I
have probably not read it even twice. However, it does not mean that it will
ever be completed.</p>


## The exponential matrix method

This method is based on the following result from ODE theory. Consider a linear
system of ordinary differential equations of the form

\begin{equation}
\begin{cases}
\dot x (t) = A x(t),\qquad t \in [0, T] \\\\x(0) = x_0
\end{cases},
\end{equation}

where $$x : \mathbb{R} \to \mathbb{R}^n$$ is a function, $$x_0 \in
\mathbb{R}^n$$ and $$A \in \mathbb{R}^{n \times n}$$ is a real-valued matrix.
Then the solution to the previous initial value problem is given by the matrix
exponential:

\begin{equation}
x(t) = e^{t A} x_0,\qquad t \in [0, T].
\end{equation}

It is very convenient that MATLAB provides the function `expm` which finds
the value of the matrix exponential numerically. Hence, implementing this
method only requires defining the initial condition vector $$x_0$$, the system
matrix $$A$$ and calculating the matrix exponential.

Consider the system

\begin{equation}
\dot u (t) = \begin{pmatrix}
1 & 2 & 3 \\\\ 4 & 5 & 6 \\\\ 7 & 8 & 9
\end{pmatrix} u(t),
\qquad u(0) = \begin{pmatrix}
\sin 1 \\\\ \sin 2 \\\\ \sin 3
\end{pmatrix}.
\end{equation}

The corresponding MATLAB translation and numerical solution can be computed by

{% highlight matlab %}
A = [1 2 3; 4 5 6; 7 8 9]
u0 = sin(1:3)

u = @(t) expm(t .* A) * u0'
{% endhighlight %}

A handy way of working with the solution is to define it as a MATLAB *function
handle*. A function handle is the way to define a mathematical function in
MATLAB. It allows us to evaluate an expression that depends on one or more
variables without having to retype the expression each time. In the previous
example, we can find the value of $$u$$ at say time $$t = 0.1$$ by evaluating the
expression `u(0.1)`.

In the context of the method of lines, the matrix $$A$$ is some finite difference
matrix obtained by approximating the space derivative in the first step of the
method. Further examples are given in the application section.

In terms of stability, this method does not present any problems although some
systems may yield solutions with very big numbers which overflow MATLAB's
floating point representation of numerical values. Since we will only consider
small time intervals, this will not be a problem. On the other hand, a downside
of this method is that it can only be used when the ODE system at hand is
linear.

## The Euler-Forward method

Another way of solving systems of ODEs is to apply the so-called **Euler
forward** method. The main idea behind this method is to approximate the
derivative by a finite difference

$$\dot u (t) \approx \frac{u^{n + 1} - u^n}{\Delta t}.$$

In the context of (linear) systems of ODEs we have that

\[
\dot{\mathbf u} \approx \frac{\mathbf u^{n + 1} - \mathbf u^n}{\Delta t} = A \mathbf u,
\]

where $$\mathbf u = (u_0, \dots, u_i, \dots, u_N)^T$$ is a column vector made from
the approximations $$u_i(t)$$ obtained in the first part of the method of lines.
Since there are no restrictions on what we can have on the right hand side of
the equality so this very simple method works for non-linear systems as well.
To put it more formally, given an initial value problem of the form

$$
\begin{cases}
\dot{\mathbf u} (t) = \mathbf f(t, \mathbf u(t)),\qquad t \in [0, T] \\
\mathbf u(0) = \mathbf u_0
\end{cases},
$$

the iteration of the Euler forward method is given by

$$
\mathbf u^{n + 1} = \mathbf u^n + \Delta t\, \mathbf f(t, \mathbf u^n),\qquad \mathbf u^0 = \mathbf u_0.
$$

Notice how we have arranged the iteration: given $$\mathbf u^n$$ we have an explicit
formula for obtaining the next step $$\mathbf u^{n + 1}$$. This makes implementing this
method extremely simple and also gives it an alternative name, the *explicit*
method.

However, this simplicity comes at a price. The EF method is only stable under
some circumstances. We will not dive into the general stability considerations
of the EF method in this report.

### The Euler-Backward method

The stability problems of the EF method lead us to this slightly more advanced
version: the **Euler backward** method. Again, it is based on approximating the
derivative by a finite difference, only this time we choose the index $$n + 1$$
for the right-hand side. In the context of a system of the form described in
the previous section, the iteration is given by

$$
\mathbf u^{n + 1} - \Delta t\, \mathbf f(t, \mathbf u^{n + 1}) = \mathbf u^n.
$$

Contrarily to the EF case, the next step in the iteration $$\mathbf u^{n + 1}$$ appears
implicitly in the iteration. This gives this method its alternative name, the
*implicit* method. This means that computing an iteration will be much more
complicated: depending on $$\mathbf f$$ we may even have to solve a non-linear system of
equations. If we restrict ourselves to the case of linear systems, then $$\mathbf f(t,
\mathbf u^n) = A \mathbf u^n$$ and thus the iteration becomes

$$
(I - \Delta t\,  A)\mathbf u^{n + 1} = \mathbf u^n,
$$

i.e. a system of linear equations. Matlab makes this very easy to implement
using the *backslash* (`"\"`) operator. Solving a linear system is not as
trivial as evaluating an expression as we did in EF, but this method has the
benefit that it is always stable for the applications we consider.

### The IMEX method

When a model is described by a non-linear system of ODEs, it is almost
impossible to apply the EB method since it would require a system of non-linear
equations for every step of the iteration. In this case, EF is still a
possibility, but, on the other hand, we still would like to have some stability
warranties. We introduce the IMEX method. The IMEX method owes its name to the
fact that it is a combination of the  EB (or IMplicit) and the EF (or EXplicit)
methods.

To keep things simple we shall focus on ODE systems of the particular form

$$
\dot{\mathbf u (t)} = A \mathbf u(t) + \mathbf f(\mathbf u(t)),
$$

where we can think of the right-hand side as having a linear part $$A \mathbf u$$ and a
potentially non-linear part $$\mathbf f(\mathbf u)$$. The IMEX method uses EB for the "easy"
linear part and EF for the "hard" non-linear part. Hence the iteration is given
by

$$
(I - \Delta t\, A)\mathbf u^{n + 1} = \mathbf u^n + \Delta t\, \mathbf f(\mathbf u^n).
$$

This iteration still has an implicit form, but at least we know the right-hand
side from the previous step and hence the system is always linear and can be
solved with the MATLAB *backslash* operator. Stability consideration in for
this method are much, much more elaborate and are not discussed here.