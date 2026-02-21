---
title: Fedora Silverblue 使用小记
date: 2026-02-19T21:37:00.000+08:00
updated: 2026-02-20T16:53:00.000+08:00
hidden: false
tags:
  - 随笔
  - Linux
  - Fedora
categories:
  - 随笔
---
其实很早之前就听别人说过[VanillaOS](https://vanillaos.org/)这个不可变发行版，当时我很不以为然：“‘不可变’发行版？装软件装不了、拷文件也拷不了，我还用啥？”后面才知道所谓“不可变”其实主要指的是系统文件“相对不可变“：每次更改后创建一个叠加层，而Linux运行时系统文件不可变从而保证稳定性与安全性。

以我的理解，不可变发行版主要有这些优点：

* 稳定性与安全性远超传统发行版：保证你不会手残删掉重要的系统文件，即使手残搞坏系统也可以滚回上一个叠加层；
* 开箱即用：不用折腾各种系统组件（各种 DE, WM、pulseaudio 等），安装好就能直接用；
* 通用性强：GUI软件有Flatpak兜底，CLI程序可以通过容器（例如Ubuntu）来运行，平时使用不会再有发行版焦虑；

但它的缺点其实也挺明显的：

* 占用较大：Flatpak、容器化等特点注定它与轻量发行版扯不上多少关系（当然CoreOS除外）;
* 自由度较低：改不了太多系统文件（但说回来你要高定制性选不可变发行版干啥）；
* 国内使用体验较差：很多不可变发行版没有国内软件源，以及Flathub 软件源（但现在有个ustc，能将就用）。

最后我还是选择了 Fedora Silverblue（以下简称Silverblue）来尝鲜（Red Hat大厂值得信赖XD）。

![silverblue](/images/fedora-silverblue-light.png)

## 安装

和一般发行版类似，将镜像烧录到U盘，使用[Anaconda](https://docs.fedoraproject.org/en-US/fedora/f36/install-guide/install/Installing_Using_Anaconda/)配置安装。这里建议划一整块区直接安装装（不建议手动分区，因为不可变发行版的目录结构与一般的发行版是有区别的）。

## 配置

### 更换软件源

众所周知，在国内安装好Linux的第一步就是换源。这一步与普通发行版没有太大区别（在Silverblue中/etc目录是可变的），我这里选择的是[USTC源](https://mirrors.ustc.edu.cn/help/fedora.html)，在终端输入以下命令即可：

```bash
sudo sed -e 's|^metalink=|#metalink=|g' \
         -e 's|^#baseurl=http://download.example/pub/fedora/linux|baseurl=https://mirrors.ustc.edu.cn/fedora|g' \
         -i.bak \
         /etc/yum.repos.d/fedora.repo \
         /etc/yum.repos.d/fedora-updates.repo
```

### 添加Flathub缓存

考虑到Flatpak在不可变发行版的地位，这里强烈建议为Flathub添加缓存。还是推荐[USTC的Flathub缓存](https://mirrors.ustc.edu.cn/help/flathub.html)，由于Silverblue中已经自带了Flathub源，因此只需要在终端中输入：

```
sudo flatpak remote-modify flathub --url=https://mirrors.ustc.edu.cn/flathub
```

即可。

### 配置Apple Keyboard

参看：[
Fix fn behavior for keyboards which are identified as Apple keyboard ](https://discussion.fedoraproject.org/t/fix-fn-behavior-for-keyboards-which-are-identified-as-apple-keyboard/80635)

我买的迈从K99键盘是Apple布局，为了正确映射功能键，得改一些配置。

首先用nano编辑 `/etc/modprobe.d/hid_apple.conf`：

```bash
nano /etc/modprobe.d/hid_apple.conf
```

在其中添加内容：

```
options hid_apple fnmode=2
```

最后为了持久化更改，得手动添加个叠加层：

```bash
rpm-ostree initramfs --enable --arg=-I --arg=/etc/modprobe.d/hid_apple.conf
```

## rpm-ostree常用操作

![rpm-ostree](/images/rpm-ostree-square.png)

Silveblue的包管理与系统升级采用rpm-ostree原子部署。每一次操作都是：

> 构建一个新的系统快照 → 重启切换。

在Silverblue上，推荐的软件包管理方式其实是：

| 场景     | 推荐方式               |
| ------ | ------------------ |
| GUI 应用 | Flatpak            |
| CLI 工具 | Toolbox            |
| 必须系统级包 | rpm-ostree install |
| 内核/驱动  | rpm-ostree         |

也就是一个原则：非必须不使用rpm-ostree。

### Deployment（部署）

Silverblue的每次安装/升级都会生成一个新的系统快照。且可以同时保留多个版本。

在终端中输入：

```bash
rpm-ostree status
```

下面是我的输出：

```
State: idle
Deployments:
● fedora:fedora/43/x86_64/cosmic-atomic
                  Version: 43.20260124.0 (2026-01-24T00:29:34Z)
               BaseCommit: a7f9b18ed38b5ffb2ba054934e5122a0ca76dd618b970b34bb44da2e02b7ddd1
             GPGSignature: Valid signature by C6E7F081CF80E13146676E88829B606631645531
      RemovedBasePackages: noopenh264 2.6.0-2.fc43
          LayeredPackages: distrobox fcitx5-autostart fcitx5-rime git-credential-libsecret
                           langpacks-zh_CN librime-lua mozilla-openh264 openh264 wqy-microhei-fonts
                           wqy-zenhei-fonts xdg-desktop-portal-kde
            LocalPackages: clash-nyanpasu-1.6.1-1.x86_64 javascriptcoregtk4.0-2.47.2-3.fc42.x86_64
                           starship-1.24.2-1.fc43.x86_64 webkit2gtk4.0-2.47.2-3.fc42.x86_64
                Initramfs: -I /etc/modprobe.d/hid_apple.conf 

  fedora:fedora/43/x86_64/cosmic-atomic
                  Version: 43.20260124.0 (2026-01-24T00:29:34Z)
               BaseCommit: a7f9b18ed38b5ffb2ba054934e5122a0ca76dd618b970b34bb44da2e02b7ddd1
             GPGSignature: Valid signature by C6E7F081CF80E13146676E88829B606631645531
      RemovedBasePackages: noopenh264 2.6.0-2.fc43
          LayeredPackages: fcitx5-autostart fcitx5-rime git-credential-libsecret langpacks-zh_CN
                           librime-lua mozilla-openh264 openh264 wqy-microhei-fonts wqy-zenhei-fonts
                           xdg-desktop-portal-kde
            LocalPackages: clash-nyanpasu-1.6.1-1.x86_64 javascriptcoregtk4.0-2.47.2-3.fc42.x86_64
                           starship-1.24.2-1.fc43.x86_64 webkit2gtk4.0-2.47.2-3.fc42.x86_64
                Initramfs: -I /etc/modprobe.d/hid_apple.conf
```

在这里你可以看到有哪些存在的系统快照，以及每个快照存在哪些叠加上去的软件包。你可以在GRUB中切换要启动的系统快照。

如果你要清理旧的部署，运行：

```bash
rpm-ostree cleanup -m
```

即可删除旧镜像缓存。

### Layered Packages（分层包）

你可以在基础镜像之上“叠加”RPM包：

```bash
rpm-ostree install vim
```

叠加上去的软件包只有重启后才能使用。

删除分层包：

```bash
rpm-ostree remove vim
```

同理，只有重启后更改才会生效。

### 升级/回滚系统

在终端中输入：

```bash
rpm-ostree upgrade
```

执行后系统会下载新镜像 -> 创建新deployment，最后需要重启切换。

如果升级后出问题：

```bash
rpm-ostree rollback
reboot
```

就可以切换到上一个deployment。

其他的操作可以去看[Silverblue（Atomic） 的官方文档](https://docs.fedoraproject.org/en-US/atomic-desktops/)。

## Toolbox

![toolbx](/images/toolbox-square.png)

[Toolbox](https://containertoolbx.org/)是以Podman（Docker的开源平替）为后端的的面向开发者的容器化工作环境工具。目的是为了在不可变发行版上创建可变的开发环境。说人话就是分块儿地（容器）装你那一大坨开发要用的软件包（gcc, clang, node, python啥的），免得把你系统给搞”脏“了。Silverblue已经自带了 Toolbox，因此我们直接创建新容器就行了：

```bash
toolbox create devbox --distro ubuntu --release 24.04
```

之后要进入容器，直接输入`toolbox enter devbox`就行了。在容器里面就和一般的发行版一样，想干啥干啥。

## VSCode

Jump to：[在Silverblue中配置VSCode开发环境](/2026/02/20/2026-02-21-%E5%9C%A8silverblue%E4%B8%AD%E9%85%8D%E7%BD%AEvscode%E5%BC%80%E5%8F%91%E7%8E%AF%E5%A2%83/#more)

## 总结

还没用多久，以后再来总结吧qwq。
