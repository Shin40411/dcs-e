import { Box, Grid, Skeleton } from "@mui/material";

export const renderSkeleton = () => (
    <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 4 }}>
                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width={180} height={28} />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Grid size={{ xs: 12, md: 6 }} key={i}>
                                <Skeleton variant="rectangular" height={40} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ mb: 3 }}>
                    <Skeleton variant="text" width={160} height={28} />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {Array.from({ length: 6 }).map((_, i) => (
                            <Grid size={{ xs: 12, md: 6 }} key={i}>
                                <Skeleton variant="rectangular" height={40} />
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box>
                    <Skeleton variant="text" width={180} height={28} />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Grid size={{ xs: 12, md: 6 }} key={i}>
                                <Skeleton variant="rectangular" height={40} />
                            </Grid>
                        ))}
                        <Grid size={{ xs: 12 }}>
                            <Skeleton variant="rectangular" height={100} />
                        </Grid>
                    </Grid>
                </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 8 }}>
                <Box>
                    <Skeleton variant="text" width={150} height={28} />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Grid size={{ xs: 12, md: 2.4 }} key={i}>
                                <Skeleton variant="rectangular" height={40} />
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                        <Skeleton variant="text" width={120} />
                        <Skeleton variant="text" width={100} />
                    </Box>
                </Box>
            </Grid>
        </Grid>
    </Box>
);