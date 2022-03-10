import PropTypes from 'prop-types';
import { Link as RouterLink } from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import { blue } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import CardActions from '@mui/material/CardActions';
import CardActionArea from '@mui/material/CardActionArea';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
  color: theme.palette.text.disabled
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

FundPostCard.propTypes = {
  post: PropTypes.object.isRequired,
  index: PropTypes.number
};

export default function FundPostCard({ post, index, onSelect }) {
  const { cover, title, view, fb, twitter, website, share, author, createdAt } = post;
  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;

  const POST_INFO = [
    { link: fb, icon: 'eva:facebook-fill' },
    { link: twitter, icon: 'eva:twitter-fill' },
    { link: website, icon: 'eva:globe-outline' }
  ];

  const handleSelect = () => {
    onSelect(post);
  };

  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
        <CardActionArea
          onClick={handleSelect}>
          <CardMediaStyle
            sx={{
              ...((latestPostLarge || latestPost) && {
                pt: 'calc(100% * 4 / 3)',
                '&:after': {
                  top: 0,
                  content: "''",
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72)
                }
              }),
              ...(latestPostLarge && {
                pt: {
                  xs: 'calc(100% * 4 / 3)',
                  sm: 'calc(100% * 3 / 4.66)'
                }
              })
            }}
          >
            <SvgIconStyle
              color="paper"
              src="/static/icons/shape-avatar.svg"
              sx={{
                width: 80,
                height: 36,
                zIndex: 9,
                bottom: -15,
                position: 'absolute',
                ...((latestPostLarge || latestPost) && { display: 'none' })
              }}
            />
            <AvatarStyle
              alt={author.name}
              src={author.avatarUrl}
              sx={{
                ...((latestPostLarge || latestPost) && {
                  zIndex: 9,
                  top: 24,
                  left: 24,
                  width: 40,
                  height: 40
                })
              }}
            />

            <CoverImgStyle alt={title} src={cover} />
          </CardMediaStyle>

          <CardContent
            sx={{
              pt: 4,
              ...((latestPostLarge || latestPost) && {
                bottom: 0,
                width: '100%',
                position: 'absolute'
              })
            }}
          >
            <Typography
              gutterBottom
              variant="caption"
              sx={{ color: 'text.disabled', display: 'block' }}
            >
              {fDate(createdAt)}
            </Typography>

            <TitleStyle
              color="inherit"
              variant="subtitle2"
              sx={{
                ...(latestPostLarge && { typography: 'h5', height: 60 }),
                ...((latestPostLarge || latestPost) && {
                  color: 'common.white',
                  cursor: 'pointer'
                })
              }}
            >
              {title}
            </TitleStyle>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <InfoStyle>
            {POST_INFO.filter((info) => info.link != null && info.link !== '').map(
              (info, index) => (
                <Link href={info.link} target="_blank" key={info.icon}>
                  <IconButton style={{ color: blue[500] }}>
                    <Iconify icon={info.icon} sx={{ width: 32, height: 32 }} />
                  </IconButton>
                </Link>
              )
            )}
          </InfoStyle>
        </CardActions>
      </Card>
    </Grid>
  );
}
