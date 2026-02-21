---
title: 解决Flatpak版VSCode无法使用Fcitx5
date: 2026-02-21T08:38:00.000+08:00
updated: 2026-02-21T11:19:00.000+08:00
hidden: false
tags:
  - Linux
  - Flatpak
categories:
  - 随笔
---
## 系统环境

Fedora COSMIC Atomic 43（使用COSMIC DE），系统使用Fcitx5 + RIME。

## 问题详情

无法在Flatpak版的VSCode中正常调用Fcitx5输入中文。

## 解决方法

安装Flatpak版本的Fcitx5环境，安装完成之后重启电脑生效（注销账户重新登录好像没法生效）

```bash
flatpak install org.fcitx.Fcitx5.Addon.Rime
flatpak install org.fcitx.Fcitx5
```

## 问题分析

Flatpak环境隔离了系统环境，导致无法正常调用Fcitx5，这里是相当于给Flatpak环境添加了输入法模块程序库。

参考：[flatpak无法使用输入法的解决方法](https://zhuanlan.zhihu.com/p/510162497)

## 其它注意事项

理论上来说现在不再需要安装Flatpak版的Fcitx5了，且其它Flatpak应用不安装也是可以正常调用系统Fcitx5的，但Flatpak版VSCode只有在安装了之后才能正常调用Fcitx5，原因未知。
