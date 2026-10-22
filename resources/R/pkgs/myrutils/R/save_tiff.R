#' Save rendered object as TIFF Image
#'
#' This function saves the rendered object
#' as a TIFF image in the directory specified.
#'
#' @param object The object to be saved.
#' @param filename The name of the file to be saved.
#' @param width The width of the image in inches.
#' @param height The height of the image in inches.
#'
#' @importFrom grDevices tiff dev.off
#'
#' @return NULL. The function is called for its side effect of saving an image.
#' @examples
#' \dontrun{
#' # Assuming 'plot' is a valid plot
#' save__tiff(plot)
#' }
#' @export

save_tiff <- function(
    object,
    filename = "tiff_object.tif",
    width = 6.67,
    height = 6.67) {
    # Extract the directory name from the filename
    dir_name <- dirname(filename)

    # Create the directory if it does not exist
    if (!dir.exists(dir_name)) {
        dir.create(dir_name, recursive = TRUE)
    }

    tiff(
        filename = filename,
        width = width,
        height = height,
        units = "in",
        res = 1200,
        type = "cairo"
    )

    print(object)

    dev.off()
}
