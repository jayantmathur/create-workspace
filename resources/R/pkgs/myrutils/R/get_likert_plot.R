#' This function generates a Likert plot from the given data.
#' It groups the data by the specified 'x, y', calculates the frequency of each group, and then calculates the ratio and marker for each group.
#'
#'
#' @param data A data frame containing the data to be plotted.
#' @param x The x in the data to be grouped by along with 'y'.
#' @param y The y in the data to be grouped by along with 'x'.
#' @param likert A vector specifying the levels for the Likert scale.
#' Default is c(1:5).
#'
#' @importFrom grDevices hcl.colors
#' @importFrom ggplot2 aes geom_text theme margin labs
#' @importFrom ggpubr ggbarplot
#'
#' @return A data frame with the grouped data
#'
#' @examples
#' \dontrun{
#' get_likert_plot(data, x, y)
#' }
#'
#' @export

get_likert_plot <- function(data, x, y, likert = c(1:5)) {
    subset <- dplyr::mutate(
        dplyr::summarize(
            dplyr::group_by(data, get(x), get(y)),
            Frequency = dplyr::n()
        ),
        Ratio = Frequency / sum(Frequency), # nolint
        Marker = (cumsum(Ratio) - (Ratio / 2)) # nolint
    )

    colnames(subset)[1] <- "VariableX"
    colnames(subset)[2] <- "VariableY"

    subset$VariableY <- myrutils::recoder(
        subset$VariableY, 1:5,
        factor(likert, levels = likert)
    )

    subset$Colors <- myrutils::recoder(
        subset$VariableY, 1:5,
        c("black", "black", "black", "white", "white")
    )

    plot <- ggpubr::ggbarplot(
        data = subset,
        y = "Ratio",
        ylab = "Number of Responses",
        x = "VariableX",
        xlab = "Modality",
        fill = "VariableY",
        palette = grDevices::hcl.colors(palette = "plasma", n = 5, rev = TRUE),
        # ggtheme = plot_theme,
        orientation = "horiz",
        position = ggplot2::position_stack(reverse = TRUE)
    ) +
        plot_theme +
        ggplot2::labs(fill = "Response") +
        ggplot2::geom_text(
            ggplot2::aes(y = Marker, label = Frequency, group = VariableY), # nolint
            color = subset$Colors
        ) +
        ggplot2::theme(
            axis.text.x = ggplot2::element_blank(),
            axis.ticks.x = ggplot2::element_blank(),
        )

    return(plot)
}
