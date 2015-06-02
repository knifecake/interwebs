---
layout: post
title: Plain text is for the future
---

There's always the possibility that any tool you use will eventually become obsolete and disappear from the market. This is especially true for software: you get used and start to work with Microsoft Word but a year later there is a newer version already. If you want to keep your school notes and homework, or any document, for years to come you need a better solution. Thankfully there's something all these formats have in common, they are based on reliable plain text files. With these you don't need to bother about formats nor extensions. You can just save some text as a `.txt` and it will be readable in every system out there, for many years to come.

But what about formatting? There are ways in which you can format plain text files. Look at [Markdown](http://daringfireball.com/markdown "Markdown Official Documentation") for example, it tries to solve this problem in a way that is not intrusive for the writer. In fact, Markdown is what I'm currently using to type this post now. But there's one last problem. Formatting may be acceptable for you but how on earth are you going to submit that essay all typed in monospace font without headings, italics or any kind of *beautiful* formatting. That's where document processors come in handy.

It is actually possible to write in Markdown and have a program output a beautifully typeset PDF, ready for you to email to your teacher (or print if you still do that). Here comes the problem though, search the web for `markdown to pdf` and prepare to be overwhelmed by a ton of resources, none of them easy to say the least. But that's what we'll do here: install and configure everything to get you up and running in no time.

## LaTeX and the typesetting hell
You may have tried to use one of those sites that says "upload your private files to me, I will give you a PDF". That's okay if you want to give away your work and privacy. We can do better, in two ways. We can achieve superior quality documents and not depend on someone we don't even know. For that we will use LaTeX a typesetting system. LaTeX is a kind of language that will allow you to type plain text in any editor (read Notepad if on Windows) and convert it to a PDF or other type of printable document. However, writing LaTeX by hand can be tyring and not very productive, especially if you are not typing math or customizing the output all day.

Here's when Markdown comes in and saves us from spending a month learning to type LaTeX. Markdown is not so feature complete, you only get headings, text styles, links, images, quotations and tables if you are lucky. But look at the benefits, you can learn it in half an hour and your documents will be readable in a plain text editor. After all you are not using fancy WordArt everyday now, are you?

Okay, wait, we said Markdown is easier than LaTeX, but can we get beautiful documents with it as well. Well, sadly, Markdown was designed to *compile* into HTML, the language used for websites. You could generate the HTML file, open it in your browser and print it but it certainly won't give you very good results. So how do you turn a Markdown file into a printable thing?

## Pandoc comes to rule them all
More nerdy terms, you saying? This is the last one I promise. [Pandoc](http://pandoc.org "Pandoc homepage") likes to call itself a *universal document converter*. It basically converts documents from one format such as Markdown.
