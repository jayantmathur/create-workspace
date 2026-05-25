#
# Install essential packages
#

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
            }
        }
    )
}

packages <- c(
    "languageserver",
    "jsonlite",
    "IRkernel"
)

packages_check(packages)

IRkernel::installspec()
