min_packages <- c("IRkernel", "tidyverse", "ggpubr", "devtools", "emmeans", "stringi")
install.packages(
    min_packages,
    repos = "https://cloud.r-project.org"
)
IRkernel::installspec()


# conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/main;
# conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/r;
# conda tos accept --override-channels --channel https://repo.anaconda.com/pkgs/msys2;


# conda init powershell;
# conda install jupyter -y;