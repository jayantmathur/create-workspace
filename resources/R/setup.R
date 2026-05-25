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

min_packages <- c(
    "languageserver",
    "jsonlite",
    "IRkernel"
)

packages_check(min_packages)

IRkernel::installspec()

# conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main;
# conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r;
# conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/msys2;

# conda init powershell;
# conda install jupyter -y;
