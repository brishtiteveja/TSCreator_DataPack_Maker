#! /usr/bin/env python

import os

VERSION_PATH = "./version"


def old_version():
    version_file = open(VERSION_PATH, "r")
    version = version_file.read().strip()
    version_file.close()
    return version


def new_version():
    version_file = open(VERSION_PATH, "r")
    version = version_file.read().strip().split('.')
    version[-1] = str(int(version[-1]) + 1)
    version_file.close()
    return '.'.join(version)


def update_version():
    ver = new_version()
    version_file = open(VERSION_PATH, "w")
    version_file.write(ver)
    version_file.close()


def update_transect_min():
    """Transect min"""
    transect_min = "./transect_maker/html/transect_min.html"
    transect_old_built = "transect-maker-built." + old_version() + ".js"
    transect_new_built = "transect-maker-built." + new_version() + ".js"
    cmd = "sed s/" + transect_old_built + "/" + transect_new_built + "/g " + transect_min + " > " + transect_min + ".bak && mv " + transect_min + ".bak " + " " + transect_min
    os.system(cmd)


def update_transect_built():
    main = "transect_maker/js/transect_app"
    transect_built = "./transect-maker-built.js"
    transect_new_built = "transect_maker/js/transect-maker-built." + new_version() + ".js"
    cmd = "r.js -o " + transect_built + " name=" + main + " out=" + transect_new_built
    os.system(cmd)


def clean_transect():
    cmd = "rm transect_maker/js/transect-maker-built.*.js"
    os.system(cmd)


def update_transect():
    clean_transect()
    update_transect_min()
    update_transect_built()


def update_block_min():
    block_min = "./block_column_maker/html/block_column_maker_min.html"
    block_old_built = "block-column-maker-built." + old_version() + ".js"
    block_new_built = "block-column-maker-built." + new_version() + ".js"
    cmd = "sed s/" + block_old_built + "/" + block_new_built + "/g " + block_min + " > " + block_min + ".bak && mv " + block_min + ".bak " + " " + block_min
    os.system(cmd)


def update_block_built():
    main = "block_column_maker/js/block_app"
    block_built = "./block-column-maker-built.js"
    block_new_built = "block_column_maker/js/block-column-maker-built." + new_version() + ".js"
    cmd = "r.js -o " + block_built + " name=" + main + " out=" + block_new_built
    os.system(cmd)


def clean_block():
    cmd = "rm block_column_maker/js/block-column-maker-built.*.js"
    os.system(cmd)


def update_block():
    clean_block()
    update_block_min()
    update_block_built()


def update_reference_min():
    reference_min = "./reference_column_maker/html/reference_column_maker_min.html"
    reference_old_built = "reference-column-maker-built." + old_version() + ".js"
    reference_new_built = "reference-column-maker-built." + new_version() + ".js"
    cmd = "sed s/" + reference_old_built + "/" + reference_new_built + "/g " + reference_min + " > " + reference_min + ".bak && mv " + reference_min + ".bak " + " " + reference_min
    os.system(cmd)


def update_reference_built():
    main = "reference_column_maker/js/reference_column_app"
    reference_built = "./reference-column-maker-built.js"
    reference_new_built = "reference_column_maker/js/reference-column-maker-built." + new_version() + ".js"
    cmd = "r.js -o " + reference_built + " name=" + main + " out=" + reference_new_built
    os.system(cmd)


def clean_reference():
    cmd = "rm reference_column_maker/js/reference-column-maker-built.*.js"
    os.system(cmd)


def update_reference():
    clean_reference()
    update_reference_min()
    update_reference_built()


def update_lithology_min():
    lithology_min = "./lithology_column_maker/html/lithology_column_maker_min.html"
    lithology_old_built = "lithology-column-maker-built." + old_version() + ".js"
    lithology_new_built = "lithology-column-maker-built." + new_version() + ".js"
    cmd = "sed s/" + lithology_old_built + "/" + lithology_new_built + "/g " + lithology_min + " > " + lithology_min + ".bak && mv " + lithology_min + ".bak " + " " + lithology_min
    os.system(cmd)


def update_lithology_built():
    main = "lithology_column_maker/js/lithology_app"
    lithology_built = "./lithology-column-maker-built.js"
    lithology_new_built = "lithology_column_maker/js/lithology-column-maker-built." + new_version() + ".js"
    cmd = "r.js -o " + lithology_built + " name=" + main + " out=" + lithology_new_built
    os.system(cmd)


def clean_lithology():
    cmd = "rm lithology_column_maker/js/lithology-column-maker-built.*.js"
    os.system(cmd)


def update_lithology():
    clean_lithology()
    update_lithology_min()
    update_lithology_built()


def main():
    update_reference()
    update_transect()
    update_block()
    update_lithology()
    update_version()

main()
