---
layout: post
title: Setting up my document workflow
---

**Where I come from:** Apple Pages for everything. No math equations, no easy
collaboration or sharing of documents across *my own* devices (yes do not use
iCloud Drive), no real version control, tied to an ecosystem, large documents.

**Where I want to go:** Plain text documents for everything, using
[Markdown](http://whatismarkdown.com "Unofficial markdown description") or
[LaTeX](http://www.latex-project.org "LaTeX project home") as needed, with
global templates for consistent, personal formatting and
[Pandoc](http://pandoc.org "Pandoc website") to handle the needed document
conversions. Future proof format, can be used with Git (you even get diffs),
collaborate with anyone who has a text editor, math comes for free with LaTeX,
small documents readable by any computer. Also, I get to post documents here
without any conversion needed.

## Markdown, LaTeX and the typesetting hell

Don't get me wrong here, Markdown is not a typesetting program. It's just a
format that makes it easier for you to write formatted text in a way so that
source files can be read by a human comfortably. That last part is key, if it
weren't for it I would be using LaTeX straight away but it's too cluttered with
commands for the source files to be readable. What we will do is write Markdown
and then have Pandoc output any format we like. Today I will focus on outputting
PDFs and for this Pandoc uses LaTeX.

LaTeX can be difficult to get working, I will explain how to get it set up on
Mac, you can try to follow along on a PC, but you will have to look for the
corresponding versions of the software we will use. Also, LaTeX allows for
infinite customization of documents but that requires getting really dirty with
`.tex` files. We will sacrifice almost every style decision you were used to
taking when working with Microsoft Word. Will your documents look similar or the
same as every one else's (every one who uses LaTeX at least)? Yes, but they'll
look good. Really good and you can still chose serif or sans serif fonts 😜.

## Getting Started

I'll assume you are comfortable with the command line and can edit plain text
files without problem.

1. Okay, go ahead and install LaTeX. How? You could install the full TexLive
   distribution which is over 2GB in size. Perhaps it is better to grab the
   basic package which includes almost anything you'll every need plus a package
   manager for all kinds of LaTeX extensions or packages. Download the installed
   for BasicTex from [MacTex](https://www.tug.org/mactex/morepackages.html
   "MacTex, Tex Users Group"). Follow instructions to install it (it's a common
   OSX package) and you are ready to continue.
2. Most likely, the packages you just installed are a bit outdated. Run `sudo
   tlmgr update --self && sudo tlmgr update --all` to update both the package
   manager and all the packages. If when running `pandoc` it complains about a
   missing package you may install it easily by executing `sudo tlmgr install
   my-package`. The package archive lives [here](http://ctan.org "CTAN").
3. Next head to
   [http://pandoc.org/installing.html](http://pandoc.org/installing.html "Pandoc
   Install page") and follow instructions to download and install the Mac
   package.
4. You are pretty much done. Check everything is working by creating a plain
   text document (perhaps `test.md` is a good name). Write some Markdown in it
   and save, then execute `pandoc -o test.pdf test.md` and, wait for it, you
   have a beautiful PDF document from that ugly text file.

## Diving deeper

Okay, perhaps it is not the most beautiful document ever. We can try to do
better. Try using a custom template to wrap the Markdown around so that you
don't get huge margins and can include headers and footers.
[This](https://github.com/knifecake/dotfiles/blob/master/osx/school-tools/templates/default.tex.template
"LaTeX template") is the one I use currently. To render a file within a template
run `pandoc -o document.pdf --template path/to/template.tex` and let Markdown do
rest. It will find special strings inside the template such as `$body$` and
substitute them with the appropriate parts of your document, in this case, the
contents of the file. Here's the official Pandoc documentation for templates:
[http://pandoc.org/README.html#templates](http://pandoc.org/README.html#templates
"Pandoc template documentation"). 

Also, you can now commit your documents to version control the right way. If
you've never used a version control system (VCS) go ahead and learn hit when
you've got some time (15 minutes to be precise) [here](https://try.github.io/
"Interactive Git tutorial"). If you already use a VCS, go ahead and commit your
changes. Take care not to commit your rendered PDF files – you can regenerate
them later and they will take up more space than the Markdown sources, plus they
are not easily modifiable. You can tell Git to ignore them by putting `*.pdf` in
your `.gitignore`.

After a short while you will probably realise how tiresome it is to compile
every document you make into a PDF or any other document type (remember Pandoc
can even do `.docx` if you ever need to share). You surely can automate this
process. I did. You can build your own scripts or check out
[mine](https://github.com/knifecake/dotfiles/blob/master/osx/scripts/produce "A
script to automate compilation"). Certainly you can do better and add options to
customize the output name, perhaps add other formats. Please feel free to build
upon it and please make a pull request if you make anything better. (I'm
thinking about using Make or Rake for this...).
