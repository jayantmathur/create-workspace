#' Check and install R packages
#'
#' This function checks if the specified packages are installed and installs them if they are not.
#'
#' @param packages A character vector of package names to check and install.
#' @return NULL
#' @importFrom utils install.packages
#' @examples
#' packages_check(c("dplyr", "ggplot2"))
#'
#' @export
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
                library(x, character.only = TRUE)
            }
        }
    )
}
