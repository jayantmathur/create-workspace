#| cache: false

packages_check <- function(packages) {
    lapply(
        packages,
        FUN = function(x) {
            if (!require(x, character.only = TRUE)) {
                install.packages(
                    x,
                    dependencies = TRUE,
                    repos = "https://cran.r-project.org/",
                    # type = "source"
                )
                # library(x, character.only = TRUE)
            }
        }
    )
}

packages <- c(
    "tidyverse",
    # "tinytable",
    "ggpubr",
    # "ggeffects",
    # "lmerTest",
    # "easystats",
    "pwr"
    # "irr",
    # "irrCAC"
)

packages_check(packages)
