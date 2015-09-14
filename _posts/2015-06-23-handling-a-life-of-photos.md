---
layout: post
title: Handling a life of photos
---

**Update:** I recently read [this great
article](http://paulstamatiou.com/storage-for-photographers-part-2/ "An article
about professional photo storage") about how a professional photographer handles
his gigabytes of photos properly. However, I still prefer my aproach, as I don't
need the original full resolution versions.

Today I will try to explain how I store all the photos I take in a way that
looks sustainable and practical to me. I try to save as much space as possible
without compromising quality and at the same time I try not to spend a lot of
time organizing photos so that I do something else.

## Importing photos from a camera

I used to wait for iPhoto to wake up and connect my camera which now is mostly
my iPhone. But flicking through forgotten OSX applications I found **Image
Capture**. I had only used it once to scan some documents but it can also handle
almost any camera. I now connect my iPhone and select the photos I want to
import and save them to a folder. That's it. No app to manage them. I tried
Photos for OSX but if you've read other posts here you already know how
concerned I am about formats that are not universal. Folders are easy, work on
every system and do not take tons of space as an iPhoto library takes.

I keep things simple with one folder for event, e.g. `italy-14` or
`christmas-12`. I don't bother renaming all the photos inside the folder – they
are already related and you can find one pretty easily.

## Saving some space

Now its the hardest time: I go over all my photos again and delete anything not
perfectly focused or anything duplicated. I am pretty aggressive and normally
trash about half of the photos I took if I didn't do any cleaning on the iPhone.
Of course you can keep them all but I try to think if all of them will be
valuable in ten years time.

Also, I do compression. I compress JPEGs to about 80%. I have tunned this for a
while and I do the following:

1. Use JPEGoptim to handle the job, it is very thorough and can be heavily
   customized. I installed it with [Homebrew](http://brew.sh "Homebrew page") by
   typing `brew install jpegoptim` onto a terminal.
2. You can tell `jpegoptim` how much to compress your images with the `-m`
   option which takes a percentage as an argument.
3. I tell `jpegoptim` not to remove any tags from the file explicitly with
   `--strip-none`. Although stripping attributes is not default behaviour it's
   better to be cautious. Also, you can preserve the original file timestamps
   and permissions with `-p` and `-P` respectively.
4. Also, you can tell `jpegoptim` not to replace the original file with a
   compressed one if the space saved is below a threshold. To specify that
   threshold as a percentage use `-T<percentage>`.

All together I run this command `jpegoptim -m80 -T40 --strip-none -p -t *.JPG`.
With the `-t` option you'll get some stats at the end of the execution. With
these settings I normally get about 55% compression on the photos I take with my
iPhone and a little more on those I take with a Cannon 1100D.

## Storage

With this I find I can take all the photos from the last year with my even on my
iPhone but things start to get pretty wild when you get photos from friends or
when you do this a lot of years in a row. For long term storage I use an
external hard drive and [Flickr](https://www.flickr.com/ "Flickr homepage"). I
would rely only on Flickr if it wasn't for the videos that I can't store.

The [Flickr Uploadr](https://www.flickr.com/tools/ "Flickr Tools") app will take
care of uploading anything you put into a folder avoiding duplicates and putting
together albums matching the folder structure on your computer. Also, it won't
delete anything from Flickr nor from your computer. Truly a non-destructive
sync.

![Cuenca 2015](/img/posts/2015/cuenca.jpg)
