---
title: 在Silverblue中配置VSCode开发环境
date: 2026-02-21T13:21:00.000+08:00
updated: 2026-02-21T13:21:00.000+08:00
hidden: false
tags:
  - VSCode
  - Fedora
  - Linux
categories:
  - 随笔
---
参看：[VSCode + Dev Containers and Toolbx/Distrobox setup for Fedora Silverblue](https://gist.github.com/lbssousa/bb081e35d483520928033b2797133d5e)

## 正文

Silverblue的VSCode配置起来还有点麻烦,这里给出一个实用性最强的方案Pwa（Toolbox+Flatpak版VSCode，Silverblue默认安装了Toolbox）。

首先安装 VSCode Flatpak：

```bash
flatpak install com.visualstudio.code
```

为了让Flatpak版的VSCode能调用podman，在终端中运行：

```bash
mkdir -p ${HOME}/.var/app/com.visualstudio.code/data/node_modules/bin
ln -sf /app/bin/host-spawn ${HOME}/.var/app/com.visualstudio.code/data/node_modules/bin/podman
```

注入一些需要用到的环境变量：

```bash
flatpak --user override --env HOST_DISPLAY="$DISPLAY" --env HOST_SHELL="$SHELL" --env HOST_SSH_AUTH_SOCK="$SSH_AUTH_SOCK" com.visualsudio.code
```

打开VSCode，安装Dev Containers扩展，然后把其后端更改为podman（`dev.containers.dockerPath = "podman"`）。

新建文件`${HOME}/.var/app/com.visualstudio.code/config/Code/User/globalStorage/ms-vscode-remote.remote-containers/nameConfigs/${YOUR_DISTROBOX_CONTAINER_NAME}.json`，然后添加以下内容：

```json
{
  "remoteUser": "${localEnv:USER}",
  "settings": {
    "dev.containers.copyGitConfig": false,
    "dev.containers.gitCredentialHelperConfigLocation": "none"
  },

  "terminal.integrated.profiles.linux": {
    "distrobox": {
      "path": "${localEnv:SHELL}",
      "args": [
        "-l"
      ]
    },
    "toolbx": {
      "path": "/usr/sbin/capsh",
      "args": [
        "--caps=",
        "--",
        "-c",
        "exec \"\$@\"",
        "/bin/sh",
        "${localEnv:SHELL}",
        "-l"
      ]
    }
  },
  "terminal.integrated.defaultProfile.linux": "toolbx",

  "remoteEnv": {
    "COLORTERM": "${localEnv:COLORTERM}",
    "DBUS_SESSION_BUS_ADDRESS": "${localEnv:DBUS_SESSION_BUS_ADDRESS}",
    "DESKTOP_SESSION": "${localEnv:DESKTOP_SESSION}",
    "DISPLAY": "${localEnv:HOST_DISPLAY}",
    "LANG": "${localEnv:LANG}",
    "SHELL": "${localEnv:HOST_SHELL}",
    "SSH_AUTH_SOCK": "${localEnv:HOST_SSH_AUTH_SOCK}",
    "TERM": "${localEnv:TERM}",
    "VTE_VERSION": "${localEnv:VTE_VERSION}",
    "XDG_CURRENT_DESKTOP": "${localEnv:XDG_CURRENT_DESKTOP}",
    "XDG_DATA_DIRS": "${localEnv:XDG_DATA_DIRS}",
    "XDG_MENU_PREFIX": "${localEnv:XDG_MENU_PREFIX}",
    "XDG_RUNTIME_DIR": "${localEnv:XDG_RUNTIME_DIR}",
    "XDG_SESSION_DESKTOP": "${localEnv:XDG_SESSION_DESKTOP}",
    "XDG_SESSION_TYPE": "${localEnv:XDG_SESSION_TYPE}"
  }
}
```

进入容器，进行以下操作：

```bash
sudo mkdir /.vscode-server
sudo chown ${USER}:${USER} /.vscode-server
ln -sf /.vscode-server ${HOME}/.vscode-server
sudo chmod 755 /root
sudo ln -sf /.vscode-server /root/.vscode-server
```

最后新建`${HOME}/.local/bin/code`，把[这里面的](https://raw.githubusercontent.com/owtaylor/toolbox-vscode/refs/heads/main/code.sh)内容添加进去，然后`chmod +x ${HOME}/.local/bin/code`。这样你就可以在开发容器中通过 `code <path>` 用VSCode来打开项目文件夹了。
