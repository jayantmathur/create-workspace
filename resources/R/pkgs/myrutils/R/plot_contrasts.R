#' Plot Contrasts
#'
#' This function creates a plot of contrasts with significance annotations.
#'
#' @param contrasts A data frame containing the contrasts to be plotted.
#' It should have columns named 'estimate' and 'p.value'.
#' @param tip_length The length of the significance annotation lines.
#' @param fontsize The font size of the significance annotations. Default is 4.
#'
#' @return A ggplot object with the plotted contrasts
#' and significance annotations.
#'
#' @examples
#' \dontrun{
#' plot_contrasts(contrasts, max = 10, unit = 1)
#' }
#'
#' @export

plot_contrasts <- function(contrasts, tip_length = 0.03, fontsize = 4) {
    plot <- ggpubr::geom_signif(
        annotation = paste0(
            "b = ",
            round(contrasts$`estimate`, 2),
            "\n",
            ifelse(
                contrasts$`p.value` < 0.001,
                "p < 0.001",
                paste0("p = ", round(contrasts$`p.value`, 3))
            )
        ),
        y_position = contrasts$y_position,
        xmin = contrasts$xmin,
        xmax = contrasts$xmax,
        vjust = -.25,
        check_overlap = TRUE,
        textsize = fontsize,
        tip_length = tip_length
    )

    return(plot)
}
