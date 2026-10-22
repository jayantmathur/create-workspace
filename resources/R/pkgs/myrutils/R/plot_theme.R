#' Custom theme for ggplot2 plots
#'
#' This function applies a custom theme to ggplot2 plots.
#' The theme includes a transparent background,
#' and no major or minor grid lines.
#'
#' @importFrom ggpubr theme_pubr
#' @importFrom ggplot2 theme element_rect element_blank element_text
#'
#' @return A ggplot2 theme object.
#' @examples
#' \dontrun{
#' p <- ggplot(mtcars, aes(mpg, disp)) +
#'     geom_point()
#' p + plot_theme()
#' }
#' @export

plot_theme <- ggpubr::theme_pubr() + ggplot2::theme(
    legend.position = "bottom",
    legend.title.position = "top",
    legend.background = ggplot2::element_rect(fill = "transparent"),
    strip.background = ggplot2::element_blank(),
    panel.background = ggplot2::element_rect(fill = "transparent"),
    panel.grid.major = ggplot2::element_blank(),
    panel.grid.minor = ggplot2::element_blank(),
    plot.background = ggplot2::element_rect(fill = "transparent", color = NA),
    axis.title.y = ggplot2::element_text(margin = ggplot2::margin(r = 20)),
)
