#  s c - y b - u n b l o c k e r ## SynopsisThis ScreenConnect extension can remotely unblock a Yubikey smartcard connected to a ScreenConnect host.## MotivationThere is no way to remotely unblock a Yubikey smartcard with standard windows tools(RDP, powershell...) so I created this extension.## InstallationDownload this extension through the ScreenConnect admin panel -> extensions. Yubikey PIV manager must also be installed on the end users computer. Configure the extension to setup the Yubikey PIV tool location if it's different than the default installation.## UsageHave the end user plug their Yubikey in, select their session in ScreenConnect and click Unblock Card. Put in your PUK(Admin PIN) in twice and click unblock. The results of the unblock should show up in the Unblock Window.## ContributorsI used the command toolbox extension by ScreenConnect as a jumping off point.## LicenseMIT LicenseCopyright (c) 2016 Jacob SommervillePermission is hereby granted, free of charge, to any person obtaining a copyof this software and associated documentation files (the "Software"), to dealin the Software without restriction, including without limitation the rightsto use, copy, modify, merge, publish, distribute, sublicense, and/or sellcopies of the Software, and to permit persons to whom the Software isfurnished to do so, subject to the following conditions:The above copyright notice and this permission notice shall be included in allcopies or substantial portions of the Software.THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS ORIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THEAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHERLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THESOFTWARE.