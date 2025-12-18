#| cache: false

# install.packages("https://github.com/jayantmathur/create-new-workspace/raw/main/resources/utils/Rutils/myrutils_0.1.0.tar.gz", repos=NULL)

library(myrutils)

packages <- c(
    "tidyverse",
    # "tinytable",
    "ggpubr"
    # "ggeffects",
    # "lmerTest",
    # "easystats",
    # "pwr",
    # "irr",
    # "irrCAC"
)

packages_check(packages)
