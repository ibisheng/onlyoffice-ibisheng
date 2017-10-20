TEMPLATE = app
CONFIG += console c++11
CONFIG -= app_bundle
CONFIG -= qt

CONFIG -= debug_and_release debug_and_release_target

SOURCES += main.cpp

linux-g++ | linux-g++-64 | linux-g++-32 {
    DEFINES += \
        LINUX \
        _LINUX \
        _LINUX_QT
}
mac {
    DEFINES += \
    LINUX \
    _LINUX \
    _LINUX_QT \
    _MAC \
    MAC \
    QT_MAC \
    _MAC_ \
    __MAC__
}
win32 {
    DEFINES += \
    WIN32
}
